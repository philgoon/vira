'use client';

import * as React from 'react';
import { VendorCard } from '@/components/vendor/VendorCard';
import type { Vendor } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search, X, PlusCircle } from 'lucide-react';
import { getVendors, createVendor, updateVendor, deleteVendor } from '@/services/firebase';
import { VendorForm } from '@/components/forms/VendorForm';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// [R8] Implements the main page for the Vendor Management feature.
export default function VendorsPage() {
  const [allVendors, setAllVendors] = React.useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = React.useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editingVendor, setEditingVendor] = React.useState<Vendor | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [vendorToDelete, setVendorToDelete] = React.useState<Vendor | null>(null);
  
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [locationFilter, setLocationFilter] = React.useState('all');
  const [ratingFilter, setRatingFilter] = React.useState('all');

  // [R7.3] Fetch initial data from the service layer.
  React.useEffect(() => {
    const fetchVendors = async () => {
      try {
        setIsLoading(true);
        const vendors = await getVendors();
        setAllVendors(vendors);
        setFilteredVendors(vendors);
      } catch (error) {
        toast({ title: "Error", description: "Could not fetch vendors.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, [toast]);

  const uniqueLocations = React.useMemo(() => {
    const locations = new Set(allVendors.map(v => v.location).filter(Boolean));
    return ['all', ...Array.from(locations)];
  }, [allVendors]);

  const applyFilters = React.useCallback(() => {
    let vendors = [...allVendors];
    if (searchTerm) {
      vendors = vendors.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (locationFilter !== 'all') {
      vendors = vendors.filter(v => v.location === locationFilter);
    }
    if (ratingFilter !== 'all') {
      vendors = vendors.filter(v => v.rating >= parseFloat(ratingFilter));
    }
    setFilteredVendors(vendors);
  }, [allVendors, searchTerm, locationFilter, ratingFilter]);

  React.useEffect(() => {
    applyFilters();
  }, [searchTerm, locationFilter, ratingFilter, allVendors, applyFilters]);

  // [R8.1] & [R8.3] Handle saving a new or edited vendor.
  const handleSave = async (data: any, vendorId?: string) => {
    setIsSaving(true);
    try {
      const vendorData = { ...data, services: data.services.split(',').map((s:string) => s.trim()) };
      if (vendorId) {
        const updated = await updateVendor(vendorId, vendorData);
        setAllVendors(allVendors.map(v => v.id === vendorId ? updated : v));
        toast({ title: "Success", description: "Vendor updated successfully." });
      } else {
        const newVendor = await createVendor(vendorData);
        setAllVendors([newVendor, ...allVendors]);
        toast({ title: "Success", description: "Vendor created successfully." });
      }
      setShowForm(false);
      setEditingVendor(null);
    } catch (error) {
      toast({ title: "Error", description: "Could not save vendor.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  // [R8.4] Handle deleting a vendor.
  const handleDelete = async () => {
    if (!vendorToDelete) return;
    try {
      await deleteVendor(vendorToDelete.id);
      setAllVendors(allVendors.filter(v => v.id !== vendorToDelete.id));
      toast({ title: "Success", description: "Vendor deleted successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Could not delete vendor.", variant: "destructive" });
    } finally {
      setVendorToDelete(null);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-12 w-full" />
          <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
             {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
       <AlertDialog open={!!vendorToDelete} onOpenChange={() => setVendorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vendor "{vendorToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">Our Vendors</h1>
         {!showForm && (
            <Button onClick={() => { setEditingVendor(null); setShowForm(true); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Vendor
            </Button>
         )}
      </div>

      {showForm ? (
        <VendorForm 
          vendor={editingVendor}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingVendor(null); }}
          isSaving={isSaving}
        />
      ) : (
        <>
          <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
             {/* Filter controls */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {filteredVendors.map((vendor) => (
              <VendorCard 
                key={vendor.id} 
                vendor={vendor} 
                onEdit={() => handleEdit(vendor)}
                onDelete={() => setVendorToDelete(vendor)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
