
'use client';
import * as React from 'react';
import type { Client, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, Mail, Briefcase, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
// import Image from 'next/image'; // Removed Image import
import { getClients, createClient, updateClient, deleteClient, getProjects } from '@/services/firebase';
import { ClientForm } from '@/components/forms/ClientForm';
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
} from "@/components/ui/alert-dialog";

// [R9] Implements the main page for the Client Management feature.
export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>([]);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null);

  const { toast } = useToast();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [clientData, projectData] = await Promise.all([
            getClients(),
            getProjects()
        ]);
        setClients(clientData);
        setProjects(projectData);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const getProjectCountForClient = (clientId: string) => {
    return projects.filter(p => p.clientId === clientId).length;
  };
  
  // [R9.1] & [R9.3] Handle saving a new or edited client.
  const handleSave = async (data: any, clientId?: string) => {
    setIsSaving(true);
    try {
      if (clientId) {
        const updated = await updateClient(clientId, data);
        setClients(clients.map(c => c.id === clientId ? updated : c));
        toast({ title: "Success", description: "Client updated successfully." });
      } else {
        const newClient = await createClient(data);
        setClients([newClient, ...clients]);
        toast({ title: "Success", description: "Client created successfully." });
      }
      setShowForm(false);
      setEditingClient(null);
    } catch (error) {
       toast({ title: "Error", description: "Could not save client.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // [R9.4] Handle deleting a client.
  const handleDelete = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient(clientToDelete.id);
      setClients(clients.filter(c => c.id !== clientToDelete.id));
      toast({ title: "Success", description: "Client deleted successfully." });
    } catch(error) {
       toast({ title: "Error", description: "Could not delete client.", variant: "destructive" });
    } finally {
      setClientToDelete(null);
    }
  };
  
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };


  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-12 w-full" />
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
             {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto py-8">
      <AlertDialog open={!!clientToDelete} onOpenChange={() => setClientToDelete(null)}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
           <AlertDialogDescription>
             This action cannot be undone. This will permanently delete the client "{clientToDelete?.name}".
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>Cancel</AlertDialogCancel>
           <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Clients</h1>
        {!showForm && (
            <Button onClick={() => { setEditingClient(null); setShowForm(true); }}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
            </Button>
        )}
      </div>
      {showForm ? (
          <ClientForm 
            client={editingClient}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingClient(null); }}
            isSaving={isSaving}
          />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                 <div className="flex items-center gap-4 mb-2">
                  {/* {client.logoUrl && (
                    <Image
                      src={client.logoUrl}
                      alt={`${client.name} logo`}
                      width={48}
                      height={48}
                      className="rounded-md object-contain"
                    />
                  )}*/}
                  <CardTitle className="font-headline text-xl text-primary">{client.name}</CardTitle>
                </div>
                {client.industry && (
                  <CardDescription className="text-sm text-muted-foreground">{client.industry}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm flex-grow">
                {client.contactPerson && (
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {client.contactPerson}
                  </div>
                )}
                {client.contactEmail && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="mr-2 h-4 w-4" />
                    {client.contactEmail}
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Projects: {getProjectCountForClient(client.id)}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                 <Link href={`/clients/${client.id}`} passHref legacyBehavior>
                    <Button variant="outline" size="sm">View</Button>
                 </Link>
                 <Button variant="outline" size="sm" onClick={() => handleEdit(client)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setClientToDelete(client)}>
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
