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
import type { Client } from '@/types';

// [R9.1] Defines the validation schema for the client form.
const formSchema = z.object({
  name: z.string().min(3, { message: 'Client name must be at least 3 characters.' }),
  industry: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof formSchema>;

interface ClientFormProps {
  client?: Client | null;
  onSave: (clientData: ClientFormData, clientId?: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

// [R9.1] Implements the Client form for creating and editing clients.
export function ClientForm({ client, onSave, onCancel, isSaving }: ClientFormProps) {
  const { toast } = useToast();
  const form = useForm<ClientFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || '',
      industry: client?.industry || '',
      contactPerson: client?.contactPerson || '',
      contactEmail: client?.contactEmail || '',
      notes: client?.notes || '',
    },
  });

  const onSubmit: SubmitHandler<ClientFormData> = (data) => {
    onSave(data, client?.id);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg my-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{client ? 'Edit Client' : 'Add New Client'}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client's name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Technology, Healthcare" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
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
                    <Input type="email" placeholder="contact@client.com" {...field} />
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
                    <Textarea placeholder="Any relevant notes about this client..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSaving}>
              {isSaving ? (client ? 'Saving...' : 'Creating...') : (client ? 'Save Changes' : 'Create Client')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
