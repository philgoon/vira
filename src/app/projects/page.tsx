
'use client';
import * as React from 'react';
import type { Project, Vendor, Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Briefcase, DollarSign, CalendarDays, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { getProjects, getVendors, getClients, createProject, updateProject, deleteProject } from '@/services/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// [R5] Implements the main page for the Project Interface.
export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [clients, setClients] = React.useState<Client[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);
  
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [projectData, vendorData, clientData] = await Promise.all([
          getProjects(),
          getVendors(),
          getClients(),
        ]);
        setProjects(projectData);
        setVendors(vendorData);
        setClients(clientData);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch initial data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);


  // [R5.4] Handles saving a new or edited project.
  const handleSaveProject = async (projectData: Project) => {
    setIsSaving(true);
    try {
        if (editingProject) {
            const updated = await updateProject(projectData.id, projectData);
            setProjects(projects.map(p => p.id === updated.id ? updated : p));
            toast({ title: "Success", description: "Project updated successfully." });
        } else {
            const newProject = await createProject(projectData);
            setProjects([newProject, ...projects]);
            toast({ title: "Success", description: "Project created successfully." });
        }
        setEditingProject(null);
        setShowForm(false);
    } catch (error) {
        toast({ title: "Error", description: "Could not save project.", variant: "destructive" });
    } finally {
        setIsSaving(false);
    }
  };

  // [R5.5] Handles deleting a project.
  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
        await deleteProject(projectToDelete.id);
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        toast({ title: "Success", description: "Project deleted successfully." });
    } catch (error) {
        toast({ title: "Error", description: "Could not delete project.", variant: "destructive" });
    } finally {
        setProjectToDelete(null);
    }
  };
  
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  const handleAddNewClick = () => {
    setEditingProject(null);
    setShowForm(true);
  };
  
  if (isLoading) {
      return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
           <AlertDialogDescription>
             This action cannot be undone. This will permanently delete the project "{projectToDelete?.name}".
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>Cancel</AlertDialogCancel>
           <AlertDialogAction onClick={handleDeleteProject}>Continue</AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Projects</h1>
        {!showForm && (
            <Button onClick={handleAddNewClick} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Project
            </Button>
        )}
      </div>
      {showForm ? (
        <ProjectForm
            project={editingProject}
            vendors={vendors}
            clients={clients}
            onSave={handleSaveProject}
            onCancel={handleCancel}
            isSaving={isSaving}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <Card key={project.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-primary">{project.name}</CardTitle>
                        <CardDescription className="line-clamp-3 h-[60px]">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                        <CheckCircle2 className={`mr-2 h-4 w-4 ${project.status === 'Completed' ? 'text-green-500' : 'text-gray-500'}`} />
                        Status: {project.status}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4 text-accent" />
                        Budget: ${project.budget.toLocaleString()}
                        </div>
                        {project.startDate && (
                        <div className="flex items-center text-muted-foreground">
                            <CalendarDays className="mr-2 h-4 w-4" />
                            Start: {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        )}
                        {project.vendorId && (
                        <div className="flex items-center text-muted-foreground">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Vendor: {vendors.find(v => v.id === project.vendorId)?.name || 'N/A'}
                        </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                        <Link href={`/projects/${project.id}`} passHref legacyBehavior>
                            <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(project)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setProjectToDelete(project)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
