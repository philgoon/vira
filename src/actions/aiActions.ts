'use server';

import type { VendorRecommendationInput, VendorRecommendationOutput } from '@/ai/flows/vendor-recommendation';
import { recommendVendors as recommendVendorsFlow } from '@/ai/flows/vendor-recommendation';
import type { InteractiveVendorQAInput, InteractiveVendorQAOutput } from '@/ai/flows/interactive-vendor-qa';
import { interactiveVendorQA as interactiveVendorQAFlow } from '@/ai/flows/interactive-vendor-qa';
import { mockVendors } from '@/data/mock'; // For fetching full vendor details

export async function getVendorRecommendations(input: VendorRecommendationInput): Promise<VendorRecommendationOutput> {
  try {
    const recommendations = await recommendVendorsFlow(input);
    return recommendations;
  } catch (error) {
    console.error("Error in getVendorRecommendations:", error);
    // Consider returning a more user-friendly error structure or throwing specific error types
    throw new Error("Failed to get vendor recommendations from AI.");
  }
}

export async function askVendorQuestion(input: InteractiveVendorQAInput): Promise<InteractiveVendorQAOutput> {
  try {
    const answer = await interactiveVendorQAFlow(input);
    return answer;
  } catch (error) {
    console.error("Error in askVendorQuestion:", error);
    throw new Error("Failed to get answer from ViRA chatbot.");
  }
}
