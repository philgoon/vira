'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Vendor } from '@/types';
import { MapPin, Star, Users, Eye, Edit, Trash2 } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
  matchScore?: number;
  onEdit: () => void;
  onDelete: () => void;
}

// [R8] Component for displaying a single vendor card with CRUD actions.
export function VendorCard({ vendor, matchScore, onEdit, onDelete }: VendorCardProps) {
  return (
    <Card className="w-full flex flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl duration-300 ease-in-out">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={vendor.imageUrl || 'https://placehold.co/600x400.png'}
            alt={vendor.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="business technology"
          />
          {matchScore && (
            <Badge variant="default" className="absolute top-2 right-2 bg-accent text-accent-foreground text-sm m-2">
              Match: {matchScore.toFixed(0)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-2">{vendor.name}</CardTitle>
        <CardDescription className="flex items-center text-muted-foreground mb-1">
          <MapPin className="h-4 w-4 mr-2" /> {vendor.location}
        </CardDescription>
        <div className="flex items-center text-muted-foreground mb-4">
          <Star className="h-4 w-4 mr-2 text-yellow-500" /> {vendor.rating}
          <Users className="h-4 w-4 ml-4 mr-2" /> {vendor.reviewCount} reviews
        </div>
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-1">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {vendor.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="secondary">{service}</Badge>
            ))}
            {vendor.services.length > 3 && <Badge variant="secondary">...</Badge>}
          </div>
        </div>
        {vendor.notes && (
          <p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">{vendor.notes}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30 flex justify-between">
        <Link href={`/vendors/${vendor.id}`} passHref legacyBehavior>
          <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" /> View</Button>
        </Link>
        <div className="flex gap-2">
          {/* [R8.3] Edit button */}
          <Button variant="outline" size="sm" onClick={onEdit}><Edit className="h-4 w-4" /></Button>
          {/* [R8.4] Delete button */}
          <Button variant="destructive" size="sm" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </CardFooter>
    </Card>
  );
}
