'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { Vendor } from '@/types';

// [R8.1] Defines the validation schema for the vendor form.
const formSchema = z.object({
  name: z.string().min(3, { message: 'Vendor name must be at least 3 characters.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email.' }),
  services: z.string().min(3, { message: 'Please list at least one service.' }),
  notes: z.string().optional(),
});

type VendorFormData = z.infer<typeof formSchema>;

interface VendorFormProps {
  vendor?: Vendor | null;
  onSave: (vendorData: VendorFormData, vendorId?: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

// [R8.1] Implements the Vendor form for creating and editing vendors.
export function VendorForm({ vendor, onSave, onCancel, isSaving }: VendorFormProps) {
  const { toast } = useToast();
  const form = useForm<VendorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vendor?.name || '',
      location: vendor?.location || '',
      contactEmail: vendor?.contactEmail || '',
      services: vendor?.services.join(', ') || '',
      notes: vendor?.notes || '',
    },
  });

  const onSubmit: SubmitHandler<VendorFormData> = (data) => {
    onSave(data, vendor?.id);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg my-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{vendor ? 'Edit Vendor' : 'Add New Vendor'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor's name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="vendor@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., New York, Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Web Development, SEO, Content Writing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any relevant notes about this vendor..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving}>
              {isSaving ? (vendor ? 'Saving...' : 'Creating...') : (vendor ? 'Save Changes' : 'Create Vendor')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
