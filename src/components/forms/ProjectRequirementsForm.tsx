'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"; // [FIX] Corrected mismatched quotes
import type { ProjectRequirements, VendorRecommendation } from '@/types';
import { matchVendors } from '@/services/firebase';

// [R4.1] Defines the validation schema for the project requirements form.
// [Fix 4] Removed location field as it's not needed for AI matching in this version.
const formSchema = z.object({
  scope: z.string().min(10, { message: 'Scope must be at least 10 characters.' }),
  budget: z.coerce.number().min(0, { message: 'Budget must be a positive number.' }),
  // location: z.string().min(2, { message: 'Location must be at least 2 characters.' }), // Removed
  preferredVendorAttributes: z.string().min(10, { message: 'Preferred attributes must be at least 10 characters.' }),
});

// Update the type definition to reflect the schema change
interface ProjectRequirements extends z.infer<typeof formSchema> {}

interface ProjectRequirementsFormProps {
  onRecommendations: (recommendations: VendorRecommendation[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

// [R4.1] Implements the form to get project requirements and trigger vendor matching.
export function ProjectRequirementsForm({ onRecommendations, setIsLoading }: ProjectRequirementsFormProps) {
  const { toast } = useToast();
  const form = useForm<ProjectRequirements>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scope: '',
      budget: 0,
      // location: '', // Removed
      preferredVendorAttributes: '',
    },
  });

  // [R4.1] Handles form submission, calling the matchVendors service function.
  const onSubmit: SubmitHandler<ProjectRequirements> = async (data) => {
    setIsLoading(true);
    onRecommendations([]); // Clear previous recommendations
    try {
      // Exclude location from data sent to matchVendors if it was still present
      const { location, ...requirementsWithoutLocation } = data;
      const recommendations = await matchVendors(requirementsWithoutLocation as ProjectRequirements);
      onRecommendations(recommendations);
      toast({
        title: "Recommendations generated!",
        description: "Top vendors matching your criteria are listed below.",
      });
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Could not fetch recommendations. Please try again.",
        variant: "destructive",
      });
      onRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Find Your Perfect Vendor</CardTitle>
        <CardDescription>Enter your project details and let ViRA find the best matches.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Scope</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the main goals and deliverables of your project..." {...field} />
                  </FormControl>
                  <FormDescription>
                    What are you trying to achieve?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50000" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            {/* Removed Location Field - [Fix 4]
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New York, Remote, Global" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />*/}
            <FormField
              control={form.control}
              name="preferredVendorAttributes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Vendor Attributes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Experience in e-commerce, Strong portfolio, Agile methodology" {...field} />
                  </FormControl>
                  <FormDescription>
                    What qualities are most important in a vendor?
                  </FormDescription>
                   <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Analyzing...' : 'Get Recommendations'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
