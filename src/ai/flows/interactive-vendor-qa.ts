'use server';

/**
 * @fileOverview A Genkit flow for answering specific questions about potential vendors.
 *
 * - interactiveVendorQA - A function that handles the vendor question answering process.
 * - InteractiveVendorQAInput - The input type for the interactiveVendorQA function.
 * - InteractiveVendorQAOutput - The return type for the interactiveVendorQA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveVendorQAInputSchema = z.object({
  vendorData: z.string().describe('JSON string of available vendor information.'),
  question: z.string().describe('The question about the vendor.'),
});
export type InteractiveVendorQAInput = z.infer<typeof InteractiveVendorQAInputSchema>;

const InteractiveVendorQAOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the vendor.'),
});
export type InteractiveVendorQAOutput = z.infer<typeof InteractiveVendorQAOutputSchema>;

export async function interactiveVendorQA(input: InteractiveVendorQAInput): Promise<InteractiveVendorQAOutput> {
  return interactiveVendorQAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveVendorQAPrompt',
  input: {schema: InteractiveVendorQAInputSchema},
  output: {schema: InteractiveVendorQAOutputSchema},
  prompt: `You are a vendor expert. Use the supplied vendor data to answer the question.

Vendor Data: {{{vendorData}}}

Question: {{{question}}}

Answer: `,
});

const interactiveVendorQAFlow = ai.defineFlow(
  {
    name: 'interactiveVendorQAFlow',
    inputSchema: InteractiveVendorQAInputSchema,
    outputSchema: InteractiveVendorQAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
