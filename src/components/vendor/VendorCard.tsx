'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Vendor } from '@/types';
import { MapPin, Star, Users, ExternalLink, Eye } from 'lucide-react';

interface VendorCardProps {
  vendor: Vendor;
  matchScore?: number;
}

export function VendorCard({ vendor, matchScore }: VendorCardProps) {
  return (
    <Card className="w-full overflow-hidden shadow-lg transition-all hover:shadow-xl duration-300 ease-in-out">
      <CardHeader className="p-0">
        {vendor.imageUrl && (
          <div className="relative h-48 w-full">
            <Image
              src={vendor.imageUrl}
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
        )}
      </CardHeader>
      <CardContent className="p-6">
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
      <CardFooter className="p-6 bg-secondary/30">
        <Link href={`/vendors/${vendor.id}`} passHref legacyBehavior>
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
