
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { mockClients, mockProjects } from '@/data/mock';
import type { Client, Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Users, Mail, Briefcase, DollarSign, CalendarDays, CheckCircle2, Building, Info } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = React.useState<Client | null>(null);
  const [associatedProjects, setAssociatedProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    if (clientId) {
      const foundClient = mockClients.find(c => c.id === clientId);
      setClient(foundClient || null);
      if (foundClient) {
        const projects = mockProjects.filter(p => p.clientId === clientId);
        setAssociatedProjects(projects);
      }
    }
  }, [clientId]);

  if (!client) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-muted-foreground">Loading client details or client not found...</p>
         <Link href="/clients" passHref>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/clients" passHref>
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>
      </Link>

      <Card className="overflow-hidden shadow-xl mb-8">
        <CardHeader className="p-6 bg-secondary/20">
          <div className="flex items-center gap-4">
            {client.logoUrl && (
                <Image
                src={client.logoUrl}
                alt={`${client.name} logo`}
                width={80}
                height={80}
                className="rounded-lg object-contain border bg-card p-1"
                data-ai-hint="company brand"
                />
            )}
            <div>
                <CardTitle className="font-headline text-4xl mb-1 text-primary">{client.name}</CardTitle>
                {client.industry && (
                    <CardDescription className="text-lg text-muted-foreground flex items-center">
                        <Building className="mr-2 h-5 w-5 text-primary" /> {client.industry}
                    </CardDescription>
                )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
            {client.contactPerson && (
              <div className="flex items-center text-foreground">
                <Users className="h-5 w-5 mr-3 text-accent" />
                <div>
                    <span className="font-semibold">Contact Person:</span> {client.contactPerson}
                </div>
              </div>
            )}
            {client.contactEmail && (
              <div className="flex items-center text-foreground">
                <Mail className="h-5 w-5 mr-3 text-accent" />
                <div>
                    <span className="font-semibold">Contact Email:</span> <a href={`mailto:${client.contactEmail}`} className="text-accent hover:underline">{client.contactEmail}</a>
                </div>
              </div>
            )}
             {client.notes && (
                <div className="flex items-start text-foreground">
                    <Info className="h-5 w-5 mr-3 text-accent mt-1 shrink-0" />
                    <div>
                        <span className="font-semibold">Notes:</span>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{client.notes}</p>
                    </div>
                </div>
            )}
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <section>
        <h3 className="font-headline text-2xl font-semibold mb-6 text-primary flex items-center">
          <Briefcase className="mr-3 h-6 w-6" /> Associated Projects ({associatedProjects.length})
        </h3>
        {associatedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associatedProjects.map(project => (
              <Card key={project.id} className="shadow-lg hover:shadow-xl transition-shadow bg-card">
                <CardHeader>
                  <CardTitle className="font-headline text-lg text-primary">{project.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-xs">
                  <p className="flex items-center"><CheckCircle2 className={`h-3 w-3 mr-1.5 ${project.status === 'Completed' ? 'text-green-500' : project.status === 'In Progress' ? 'text-blue-500' : 'text-gray-500'}`} /> Status: {project.status}</p>
                  <p className="flex items-center"><DollarSign className="h-3 w-3 mr-1.5 text-accent" /> Budget: ${project.budget.toLocaleString()}</p>
                  {project.startDate && <p className="flex items-center"><CalendarDays className="h-3 w-3 mr-1.5" /> Start: {new Date(project.startDate).toLocaleDateString()}</p>}
                  {project.endDate && <p className="flex items-center"><CalendarDays className="h-3 w-3 mr-1.5" /> End: {new Date(project.endDate).toLocaleDateString()}</p>}
                </CardContent>
                <CardFooter className="pt-3 border-t">
                    <Link href={`/projects/${project.id}`} passHref legacyBehavior>
                       <Button variant="link" size="sm" className="text-accent p-0 h-auto">View Project</Button>
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No projects currently associated with this client.</p>
        )}
      </section>
    </div>
  );
}

