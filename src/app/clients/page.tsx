
'use client';
import * as React from 'react';
import { mockClients, mockProjects } from '@/data/mock';
import type { Client, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Users, Mail, Briefcase, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>(mockClients);
  const [showForm, setShowForm] = React.useState(false);
  const [editingClient, setEditingClient] = React.useState<Client | null>(null);

  // Handlers for add/edit/delete would go here

  const getProjectCountForClient = (clientId: string) => {
    return mockProjects.filter(p => p.clientId === clientId).length;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Clients</h1>
        <Button onClick={() => { setShowForm(true); setEditingClient(null); }} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Client
        </Button>
      </div>

      {!showForm && clients.length === 0 && (
        <p className="text-center text-muted-foreground text-lg">No clients found. Click "Add New Client" to get started.</p>
      )}

      {!showForm && clients.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  {client.logoUrl && (
                    <Image
                      src={client.logoUrl}
                      alt={`${client.name} logo`}
                      width={48}
                      height={48}
                      className="rounded-md object-contain"
                      data-ai-hint="company logo"
                    />
                  )}
                  <CardTitle className="font-headline text-xl text-primary">{client.name}</CardTitle>
                </div>
                {client.industry && (
                  <CardDescription className="text-sm text-muted-foreground">{client.industry}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
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
                 <Link href={`/clients/${client.id}`} passHref>
                    <Button variant="outline" size="sm">View Details</Button>
                 </Link>
                {/* Placeholder for edit/delete buttons
                <Button variant="outline" size="sm" onClick={() => { setEditingClient(client); setShowForm(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => {}}>
                  <Trash2 className="h-4 w-4" />
                </Button> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
       {showForm && (
         <p className="text-center text-muted-foreground mt-8">Client form will be displayed here.</p>
       )}
    </div>
  );
}
