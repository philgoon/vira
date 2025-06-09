// [R7.2] Data Service Layer: Implements a centralized module for all Firebase interactions.
import { app, db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch, setDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Vendor, Project, Client, ProjectRequirements, VendorRecommendation } from '@/types';
import type { InteractiveVendorQAInput, InteractiveVendorQAOutput } from '@/types/ai';

const functions = getFunctions(app);

// --- VENDOR OPERATIONS ---
export const getVendors = async (): Promise<Vendor[]> => {
  const vendorsCol = collection(db, 'vendors');
  const vendorSnapshot = await getDocs(vendorsCol);
  return vendorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
};
export const getVendorById = async (id: string): Promise<Vendor | undefined> => {
  const vendorDoc = doc(db, 'vendors', id);
  const vendorSnapshot = await getDoc(vendorDoc);
  return vendorSnapshot.exists() ? { id: vendorSnapshot.id, ...vendorSnapshot.data() } as Vendor : undefined;
};
export const createVendor = async (vendorData: Omit<Vendor, 'id'>): Promise<Vendor> => {
    const docRef = await addDoc(collection(db, 'vendors'), vendorData);
    return { id: docRef.id, ...vendorData };
};
export const updateVendor = async (vendorId: string, updates: Partial<Vendor>): Promise<Vendor> => {
    const vendorDoc = doc(db, 'vendors', vendorId);
    await updateDoc(vendorDoc, updates);
    const updatedDoc = await getDoc(vendorDoc);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Vendor;
};
export const deleteVendor = async (vendorId: string): Promise<void> => {
    await deleteDoc(doc(db, 'vendors', vendorId));
};

// --- PROJECT OPERATIONS ---
export const getProjects = async (): Promise<Project[]> => {
    const projectsCol = collection(db, 'projects');
    const projectSnapshot = await getDocs(projectsCol);
    return projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};
export const getProjectById = async (id: string): Promise<Project | undefined> => {
    const projectDoc = doc(db, 'projects', id);
    const projectSnapshot = await getDoc(projectDoc);
    return projectSnapshot.exists() ? { id: projectSnapshot.id, ...projectSnapshot.data() } as Project : undefined;
};
export const getProjectsByVendor = async (vendorId: string): Promise<Project[]> => {
    const q = query(collection(db, 'projects'), where("vendorId", "==", vendorId));
    const projectSnapshot = await getDocs(q);
    return projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};
export const getProjectsByClient = async (clientId: string): Promise<Project[]> => {
    const q = query(collection(db, 'projects'), where("clientId", "==", clientId));
    const projectSnapshot = await getDocs(q);
    return projectSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
};
export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    return { id: docRef.id, ...projectData };
};
export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<Project> => {
    const projectDoc = doc(db, 'projects', projectId);
    await updateDoc(projectDoc, updates);
    const updatedDoc = await getDoc(projectDoc);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Project;
};
export const deleteProject = async (projectId: string): Promise<void> => {
    await deleteDoc(doc(db, 'projects', projectId));
};

// --- CLIENT OPERATIONS ---
export const getClients = async (): Promise<Client[]> => {
  const clientsCol = collection(db, 'clients');
  const clientSnapshot = await getDocs(clientsCol);
  return clientSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
};
export const getClientById = async (id: string): Promise<Client | undefined> => {
  const clientDoc = doc(db, 'clients', id);
  const clientSnapshot = await getDoc(clientDoc);
  return clientSnapshot.exists() ? { id: clientSnapshot.id, ...clientSnapshot.data() } as Client : undefined;
};
export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    const docRef = await addDoc(collection(db, 'clients'), clientData);
    return { id: docRef.id, ...clientData };
};
export const updateClient = async (clientId: string, updates: Partial<Client>): Promise<Client> => {
    const clientDoc = doc(db, 'clients', clientId);
    await updateDoc(clientDoc, updates);
    const updatedDoc = await getDoc(clientDoc);
    return { id: updatedDoc.id, ...updatedDoc.data() } as Client;
};
export const deleteClient = async (clientId: string): Promise<void> => {
    await deleteDoc(doc(db, 'clients', clientId));
};

// --- RATING OPERATIONS ---
export const addProjectRating = async (projectId: string, vendorId: string, rating: number): Promise<Vendor> => {
    const projectDoc = doc(db, 'projects', projectId);
    const vendorDoc = doc(db, 'vendors', vendorId);
    const batch = writeBatch(db);
    batch.update(projectDoc, { teamRating: rating });
    const projectsForVendor = await getProjectsByVendor(vendorId);
    const currentProjectIndex = projectsForVendor.findIndex(p => p.id === projectId);
    if(currentProjectIndex > -1) {
        projectsForVendor[currentProjectIndex].teamRating = rating;
    } else {
        const ratedProject = await getDoc(projectDoc);
        projectsForVendor.push({id: projectId, ...ratedProject.data(), teamRating: rating} as Project);
    }
    const ratedProjects = projectsForVendor.filter(p => p.teamRating != null && p.teamRating > 0);
    const totalRating = ratedProjects.reduce((acc, p) => acc + (p.teamRating || 0), 0);
    const newAverage = totalRating / ratedProjects.length;
    batch.update(vendorDoc, {
        rating: parseFloat(newAverage.toFixed(2)),
        reviewCount: ratedProjects.length
    });
    await batch.commit();
    const updatedVendor = await getDoc(vendorDoc);
    return { id: updatedVendor.id, ...updatedVendor.data() } as Vendor;
};

// --- AI OPERATIONS ---
// [R4.1] Connects to the deployed `matchVendors` Firebase Function.
export const matchVendors = async (requirements: ProjectRequirements): Promise<VendorRecommendation[]> => {
    const matchVendorsFunction = httpsCallable(functions, 'matchVendors');
    const response: any = await matchVendorsFunction(requirements);
    return response.data as VendorRecommendation[];
};

// [R10.2] Connects to the deployed `chatWithVira` Firebase Function.
export const chatWithVira = async (input: InteractiveVendorQAInput): Promise<InteractiveVendorQAOutput> => {
    const chatFunction = httpsCallable(functions, 'chatWithVira');
    const response: any = await chatFunction(input);
    return response.data as InteractiveVendorQAOutput;
};
