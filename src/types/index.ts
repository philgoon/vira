// [Phase 1, Task 1] Updated Vendor interface with fields from source data, changing location to timezone.
export interface Vendor {
  id: string;
  name: string;
  timezone: string; // Changed from location to timezone
  rating: number;
  reviewCount: number;
  services: string[];
  contactEmail: string;
  notes?: string; // General notes
  imageUrl?: string;
  
  // Additional fields from provided vendor data:
  status: string;
  primaryContact: string;
  contactPreference: string;
  onboardingDate: string;
  industry?: string; // Making optional based on data variability
  skills?: string; // Making optional based on data variability
  portfolioUrl?: string;
  sampleWorkUrls?: string; // No data provided for this in source, keep optional
  pricingStructure?: string; // Making optional based on data variability
  rateCost?: string; // Making optional based on data variability
  availability?: string; // Making optional based on data variability
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
  location: string; // Note: This type still uses location as per form requirements
  preferredVendorAttributes: string;
}

export interface VendorRecommendation {
  vendorName: string;
  matchScore: number;
  // We might augment this with full vendor details after fetching
  details?: Vendor;
}

// [Phase 1, Task 2] Defines the interface for detailed vendor rating records.
export interface VendorRating {
  id: string; // Unique ID for the rating record
  vendorId: string; // Link to the Vendor
  projectId: string; // Link to the Project
  
  // Fields from the detailed vendor ratings CSV:
  quality?: number; // e.g., 1-5
  communication?: number;
  reliability?: number;
  turnaroundTime?: number;
  feedback?: string; // Detailed feedback/notes
  strengths?: string; // Specific strengths noted
  weaknesses?: string; // Specific weaknesses noted
  projectDetails?: string; // Details about the project being rated
  clientName?: string; // Client associated with the project
  projectType?: string; // Type of project
  
  // Metadata (optional but good practice)
  createdAt?: string; // ISO date string
}
