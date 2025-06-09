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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Project, Vendor, Client } from '@/types';

// [R5.1] Defines the validation schema for the project form, ensuring data integrity.
const formSchema = z.object({
  name: z.string().min(5, { message: 'Project name must be at least 5 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  budget: z.coerce.number().min(0, { message: 'Budget must be a positive number.' }),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']),
  vendorId: z.string().optional(),
  clientId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type ProjectFormData = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Project | null;
  vendors: Vendor[];
  clients: Client[];
  onSave: (project: Project) => void;
  onCancel: () => void;
  isSaving: boolean;
}

// [R5] Implements the Project Interface for adding and editing projects.
export function ProjectForm({ project, vendors, clients, onSave, onCancel, isSaving }: ProjectFormProps) {
  const { toast } = useToast();
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    // [R5.2] Populates the form with existing project data for editing, or with defaults for creation.
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      budget: project?.budget || 0,
      status: project?.status || 'Planning',
      vendorId: project?.vendorId || '',
      clientId: project?.clientId || '',
      startDate: project?.startDate?.split('T')[0] || '', // Format for date input
      endDate: project?.endDate?.split('T')[0] || '', // Format for date input
    },
  });

  // [R5.3] Handles form submission, creates a complete project object, and calls the onSave callback.
  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
    const projectData: Project = {
      ...data,
      id: project?.id || `project${Date.now()}`,
      teamRating: project?.teamRating, // Preserve existing rating on edit
    };
    onSave(projectData);
    toast({
      title: project ? "Project Updated" : "Project Created",
      description: `The project "${projectData.name}" has been successfully saved.`,
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg my-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{project ? 'Edit Project' : 'Add New Project'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the project..." {...field} />
                  </FormControl>
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign a client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <SelectItem value="">None</SelectItem>
                      {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="vendorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign a vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <SelectItem value="">None</SelectItem>
                      {vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving}>
              {isSaving ? (project ? 'Saving...' : 'Creating...') : (project ? 'Save Changes' : 'Create Project')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
