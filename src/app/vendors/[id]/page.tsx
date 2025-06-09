'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getVendorById, getProjectsByVendor } from '@/services/firebase'; // Updated import
import type { Vendor, Project } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Users, Mail, Briefcase, ArrowLeft, DollarSign, CalendarDays, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// [R8.3] Implements the vendor detail page, fetching data from the service layer.
export default function VendorDetailPage() {
  const params = useParams();
  const vendorId = params.id as string;
  
  const [vendor, setVendor] = React.useState<Vendor | null>(null);
  const [relatedProjects, setRelatedProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    if (!vendorId) return;

    const fetchVendorDetails = async () => {
      setIsLoading(true);
      try {
        const foundVendor = await getVendorById(vendorId);
        if (foundVendor) {
          setVendor(foundVendor);
          // This part needs to be implemented in the service layer
           const projects = await getProjectsByVendor(vendorId);
           setRelatedProjects(projects);
        } else {
          toast({ title: "Error", description: "Vendor not found.", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch vendor details.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorDetails();
  }, [vendorId, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[320px] w-full rounded-xl" />
          <div className="space-y-4 p-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-xl text-muted-foreground">Vendor not found.</p>
        <Link href="/vendors" passHref legacyBehavior>
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Vendors
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/vendors" passHref legacyBehavior>
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
        </Button>
      </Link>
      <Card className="overflow-hidden shadow-xl">
        {/* ... Card content remains the same ... */}
        {vendor.imageUrl && (
          <div className="relative h-64 w-full md:h-80">
            <Image src={vendor.imageUrl} alt={vendor.name} layout="fill" objectFit="cover" data-ai-hint="professional services office"/>
          </div>
        )}
        <CardHeader className="p-6">
          <CardTitle className="font-headline text-4xl mb-2">{vendor.name}</CardTitle>
          <div className="flex flex-wrap gap-4 text-muted-foreground items-center mb-4">
            <span className="flex items-center"><MapPin className="h-5 w-5 mr-2 text-primary" /> {vendor.location}</span>
            <span className="flex items-center"><Star className="h-5 w-5 mr-2 text-yellow-400" /> {vendor.rating} / 5</span>
            <span className="flex items-center"><Users className="h-5 w-5 mr-2 text-primary" /> {vendor.reviewCount} Reviews</span>
            <a href={`mailto:${vendor.contactEmail}`} className="flex items-center text-accent hover:underline">
              <Mail className="h-5 w-5 mr-2" /> {vendor.contactEmail}
            </a>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <section className="mb-6">
            <h3 className="font-headline text-2xl font-semibold mb-3 text-primary">Services Offered</h3>
            <div className="flex flex-wrap gap-3">
              {vendor.services.map(service => (
                <Badge key={service} variant="default" className="text-sm px-3 py-1 bg-accent text-accent-foreground">{service}</Badge>
              ))}
            </div>
          </section>
          
          {vendor.notes && (
            <section className="mb-6">
              <h3 className="font-headline text-2xl font-semibold mb-3 text-primary">Notes</h3>
              <p className="text-foreground/80 leading-relaxed">{vendor.notes}</p>
            </section>
          )}

          <Separator className="my-8" />

          <section>
            <h3 className="font-headline text-2xl font-semibold mb-6 text-primary">Associated Projects</h3>
            {relatedProjects.length > 0 ? (
              <div className="space-y-6">
                {relatedProjects.map(project => (
                  <Card key={project.id} className="bg-secondary/30">
                    <CardHeader>
                      <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                      <CardDescription className="text-sm">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <p className="flex items-center"><CheckCircle2 className={`h-4 w-4 mr-2 ${project.status === 'Completed' ? 'text-green-500' : project.status === 'In Progress' ? 'text-blue-500' : 'text-gray-500'}`} /> Status: {project.status}</p>
                      <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-accent" /> Budget: ${project.budget.toLocaleString()}</p>
                      {project.startDate && <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary" /> Start Date: {new Date(project.startDate).toLocaleDateString()}</p>}
                      {project.endDate && <p className="flex items-center"><CalendarDays className="h-4 w-4 mr-2 text-primary" /> End Date: {new Date(project.endDate).toLocaleDateString()}</p>}
                      {project.teamRating && (
                        <div className="col-span-full">
                          <p className="flex items-center mb-1"><Star className="h-4 w-4 mr-2 text-yellow-500" /> Team Rating: {project.teamRating} / 5</p>
                          <Progress value={project.teamRating * 20} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                        <Link href={`/projects/${project.id}`} passHref legacyBehavior>
                           <Button variant="link" className="text-accent">View Project Details <ArrowLeft className="transform rotate-180 ml-1 h-4 w-4" /></Button>
                        </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No projects currently associated with this vendor.</p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
