'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { mockProjects, mockVendors } from '@/data/mock';
import type { Project, Vendor } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, DollarSign, CalendarDays, CheckCircle2, Edit, Star } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';

// Placeholder for RatingForm
// import { RatingForm } from '@/components/forms/RatingForm';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = React.useState<Project | null>(null);
  const [vendor, setVendor] = React.useState<Vendor | null>(null);
  // const [showRatingForm, setShowRatingForm] = React.useState(false);

  React.useEffect(() => {
    if (projectId) {
      const foundProject = mockProjects.find(p => p.id === projectId);
      setProject(foundProject || null);
      if (foundProject?.vendorId) {
        const foundVendor = mockVendors.find(v => v.id === foundProject.vendorId);
        setVendor(foundVendor || null);
      }
    }
  }, [projectId]);

  if (!project) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-muted-foreground">Loading project details or project not found...</p>
        <Link href="/projects" passHref>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  // const handleRatingSave = (rating: number) => {
  //   // Update project rating logic
  //   if (project) {
  //     setProject({...project, teamRating: rating});
  //   }
  //   setShowRatingForm(false);
  // };

  return (
    <div className="container mx-auto py-8">
      <Link href="/projects" passHref>
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </Link>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-4xl mb-2 text-primary">{project.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">{project.description}</CardDescription>
            </div>
            {/* <Button variant="outline" onClick={() => { /* Handle Edit */ }}>
              <Edit className="mr-2 h-4 w-4" /> Edit Project
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-secondary/30">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Status</h4>
              <Badge variant={project.status === 'Completed' ? 'default' : project.status === 'In Progress' ? 'secondary' : 'outline'}
                     className={`${project.status === 'Completed' ? 'bg-green-500 text-white' : project.status === 'In Progress' ? 'bg-blue-500 text-white': ''}`}>
                <CheckCircle2 className="mr-2 h-4 w-4" />{project.status}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Budget</h4>
              <p className="flex items-center text-lg font-medium text-accent"><DollarSign className="mr-1 h-5 w-5" />${project.budget.toLocaleString()}</p>
            </div>
            {project.startDate && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Start Date</h4>
                <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary" />{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
            )}
            {project.endDate && (
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">End Date</h4>
                <p className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-primary" />{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {vendor && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary flex items-center"><Briefcase className="mr-2 h-5 w-5" />Assigned Vendor</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/vendors/${vendor.id}`} className="text-accent hover:underline font-semibold text-lg">{vendor.name}</Link>
                <p className="text-sm text-muted-foreground">{vendor.location}</p>
                <p className="text-sm text-muted-foreground">Rating: {vendor.rating}/5 ({vendor.reviewCount} reviews)</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><Star className="mr-2 h-5 w-5 text-yellow-400" />Team Rating for this Project</CardTitle>
            </CardHeader>
            <CardContent>
              {project.teamRating ? (
                <>
                  <p className="text-3xl font-bold text-center mb-2">{project.teamRating} <span className="text-xl text-muted-foreground">/ 5</span></p>
                  <Progress value={project.teamRating * 20} className="h-3" />
                </>
              ) : (
                <p className="text-muted-foreground text-center">No team rating submitted yet.</p>
              )}
              {/* {!showRatingForm && (
                <Button variant="outline" className="mt-4 w-full md:w-auto" onClick={() => setShowRatingForm(true)}>
                  {project.teamRating ? 'Update Rating' : 'Rate this Project'}
                </Button>
              )} */}
              {/* {showRatingForm && (
                <div className="mt-4">
                  <RatingForm
                    currentRating={project.teamRating}
                    onSave={handleRatingSave}
                    onCancel={() => setShowRatingForm(false)}
                  />
                </div>
              )} */}
               <p className="text-center text-muted-foreground mt-4">Rating form will be displayed here.</p>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
