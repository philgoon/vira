
'use client';
import * as React from 'react';
import { mockProjects, mockVendors } from '@/data/mock'; // Added mockVendors
import type { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit, Trash2, Briefcase, DollarSign, CalendarDays, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Placeholder for ProjectForm component, to be created later
// import { ProjectForm } from '@/components/forms/ProjectForm';

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>(mockProjects);
  const [showForm, setShowForm] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | null>(null);

  // Handlers for add/edit/delete would go here

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Projects</h1>
        <Button onClick={() => { setShowForm(true); setEditingProject(null); }} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Project
        </Button>
      </div>

      {/* Placeholder for ProjectForm
      {showForm && (
        <div className="mb-8">
          <ProjectForm
            project={editingProject}
            onSave={(savedProject) => {
              // save logic
              setShowForm(false);
              setEditingProject(null);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        </div>
      )}
      */}
       {!showForm && projects.length === 0 && (
        <p className="text-center text-muted-foreground text-lg">No projects found. Click "Add New Project" to get started.</p>
      )}

      {!showForm && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">{project.name}</CardTitle>
                <CardDescription className="line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CheckCircle2 className={`mr-2 h-4 w-4 ${project.status === 'Completed' ? 'text-green-500' : project.status === 'In Progress' ? 'text-blue-500' : 'text-gray-500'}`} />
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
                    Vendor: {mockVendors.find(v => v.id === project.vendorId)?.name || 'N/A'}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                 <Link href={`/projects/${project.id}`} passHref>
                    <Button variant="outline" size="sm">View</Button>
                 </Link>
                {/* <Button variant="outline" size="sm" onClick={() => { setEditingProject(project); setShowForm(true); }}>
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
         <p className="text-center text-muted-foreground mt-8">Project form will be displayed here.</p>
       )}
    </div>
  );
}
