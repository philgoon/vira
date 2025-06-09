import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// [R7.1] Initialize Firebase Admin SDK
initializeApp();

// Using the correct, user-specified model name for production stability.
const geminiAI = new GoogleGenerativeAI(functions.config().gemini.key);
const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// [R4.1] Vendor Matching Function
// Force redeploy 1
export const matchVendors = functions.https.onCall(async (data, context) => {
  const { scope, budget, location, preferredVendorAttributes } = data;

  // [R4.3] Fetch all vendors from Firestore
  const firestore = getFirestore();
  const vendorsSnapshot = await firestore.collection("vendors").get();
  const vendors = vendorsSnapshot.docs.map(doc => doc.data());

  // [R4.2] Create the prompt for the Gemini agent
  const prompt = `
    You are a vendor recommendation expert. Based on the following project requirements,
    and the provided list of vendors, return a ranked list of the top 3-5 vendor names 
    that are the best match. Provide a short reason for each recommendation.

    Project Requirements:
    - Scope: ${scope}
    - Budget: $${budget}
    - Location: ${location}
    - Preferred Attributes: ${preferredVendorAttributes}

    Available Vendors:
    ${JSON.stringify(vendors, null, 2)}

    Output format should be a JSON array of objects, each with "vendorName" and "reason" keys.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Assuming the model returns a valid JSON string
    return JSON.parse(text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new functions.https.HttpsError("internal", "Failed to get vendor recommendations.");
  }
});


// [R10.2] ViRA Chat Function
export const chatWithVira = functions.https.onCall(async (data, context) => {
    const { question, vendorData } = data;

    const prompt = `
        You are ViRA, a helpful assistant with deep knowledge of the company's vendors.
        Use the provided vendor data to answer the user's question concisely.

        Vendor Data Context:
        ${vendorData}

        User's Question:
        ${question}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        return { answer };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new functions.https.HttpsError("internal", "ViRA is currently unable to respond.");
    }
});
