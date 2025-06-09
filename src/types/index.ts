
export interface Vendor {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: string[];
  contactEmail: string;
  notes?: string;
  imageUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson?: string;
  contactEmail?: string;
  industry?: string;
  notes?: string;
  logoUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  budget: number;
  startDate?: string;
  endDate?: string;
  vendorId?: string;
  clientId?: string; // Added clientId
  teamRating?: number; // Rating given by the team for this project with this vendor
}

export interface ProjectRequirements {
  scope: string;
  budget: number;
  location: string;
  preferredVendorAttributes: string;
}

export interface VendorRecommendation {
  vendorName: string;
  matchScore: number;
  // We might augment this with full vendor details after fetching
  details?: Vendor;
}
