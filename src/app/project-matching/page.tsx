'use client';

import * as React from 'react';
import { ProjectRequirementsForm } from '@/components/forms/ProjectRequirementsForm';
import { VendorCard } from '@/components/vendor/VendorCard';
import type { Vendor, VendorRecommendation } from '@/types';
import { getVendors } from '@/services/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [recommendations, setRecommendations] = React.useState<VendorRecommendation[]>([]);
  const [allVendors, setAllVendors] = React.useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const vendors = await getVendors();
            setAllVendors(vendors);
        } catch (error) {
            toast({ title: "Error", description: "Could not fetch vendors for recommendations.", variant: "destructive" });
        }
    };
    fetchInitialData();
  }, [toast]);


  const handleRecommendations = (newRecommendations: VendorRecommendation[]) => {
    // Augment recommendations with full vendor details
    const detailedRecommendations = newRecommendations.map(rec => {
      const vendorDetails = allVendors.find(v => v.name === rec.vendorName);
      return { ...rec, details: vendorDetails };
    }).filter(rec => rec.details) as (VendorRecommendation & { details: Vendor })[]; // Ensure details are present
    
    setRecommendations(detailedRecommendations);
  };

  return (
    <div className="container mx-auto py-8">
      <section className="mb-12 flex flex-col items-center">
        <ProjectRequirementsForm onRecommendations={handleRecommendations} setIsLoading={setIsLoading} />
      </section>

      {isLoading && (
        <section>
          <h2 className="text-3xl font-headline font-semibold mb-6 text-center">Finding Best Matches...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLoading && recommendations.length > 0 && (
        <section>
          <h2 className="text-3xl font-headline font-semibold mb-8 text-center">Recommended Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {recommendations.map((rec) => (
              rec.details ? <VendorCard 
                                key={rec.details.id} 
                                vendor={rec.details} 
                                matchScore={rec.matchScore * 100} 
                                onEdit={() => {}}
                                onDelete={() => {}}
                             /> : null
            ))}
          </div>
        </section>
      )}

      {!isLoading && recommendations.length === 0 && (
         <section className="mt-8">
            <Alert className="max-w-2xl mx-auto">
              <Info className="h-4 w-4" />
              <AlertTitle className="font-headline">Welcome to ViRA!</AlertTitle>
              <AlertDescription>
                Use the form above to input your project requirements. ViRA will then analyze and suggest the best vendor matches for your needs.
              </AlertDescription>
            </Alert>
        </section>
      )}
    </div>
  );
}
