"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithVira = exports.matchVendors = void 0;
const functions = __importStar(require("firebase-functions"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const generative_ai_1 = require("@google/generative-ai");
// [R7.1] Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
// Using the correct, user-specified model name for production stability.
const geminiAI = new generative_ai_1.GoogleGenerativeAI(functions.config().gemini.key);
const model = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// [R4.1] Vendor Matching Function
// Force redeploy 1
exports.matchVendors = functions.https.onCall(async (data, context) => {
    const { scope, budget, location, preferredVendorAttributes } = data;
    // [R4.3] Fetch all vendors from Firestore
    const firestore = (0, firestore_1.getFirestore)();
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
    }
    catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new functions.https.HttpsError("internal", "Failed to get vendor recommendations.");
    }
});
// [R10.2] ViRA Chat Function
exports.chatWithVira = functions.https.onCall(async (data, context) => {
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
    }
    catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new functions.https.HttpsError("internal", "ViRA is currently unable to respond.");
    }
});
//# sourceMappingURL=index.js.map