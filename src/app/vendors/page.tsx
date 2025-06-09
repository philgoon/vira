'use client'; // This page involves client-side state for potential filters in the future

import * as React from 'react';
import { VendorCard } from '@/components/vendor/VendorCard';
import { mockVendors } from '@/data/mock'; // Using mock data
import type { Vendor } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Search, X } from 'lucide-react';

export default function VendorsPage() {
  const [allVendors] = React.useState<Vendor[]>(mockVendors); // Initial full list
  const [filteredVendors, setFilteredVendors] = React.useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [locationFilter, setLocationFilter] = React.useState('all');
  const [ratingFilter, setRatingFilter] = React.useState('all');

  const uniqueLocations = React.useMemo(() => {
    const locations = new Set(allVendors.map(v => v.location));
    return ['all', ...Array.from(locations)];
  }, [allVendors]);

  const applyFilters = React.useCallback(() => {
    let vendors = [...allVendors];

    if (searchTerm) {
      vendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (locationFilter !== 'all') {
      vendors = vendors.filter(vendor => vendor.location === locationFilter);
    }

    if (ratingFilter !== 'all') {
      vendors = vendors.filter(vendor => vendor.rating >= parseFloat(ratingFilter));
    }

    setFilteredVendors(vendors);
  }, [allVendors, searchTerm, locationFilter, ratingFilter]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);
  
  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('all');
    setRatingFilter('all');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center text-primary">Our Vendors</h1>
      
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search</label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">Location</label>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger id="location" className="w-full">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {uniqueLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-foreground mb-1">Min. Rating</label>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger id="rating" className="w-full">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
                <SelectItem value="3">3.0+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={clearFilters} variant="outline" className="w-full md:w-auto">
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      </div>

      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg col-span-full">No vendors match your current filters.</p>
      )}
    </div>
  );
}
