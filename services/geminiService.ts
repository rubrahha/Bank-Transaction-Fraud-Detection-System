
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction } from '../types';

// Ensure the API key is available. In a real app, this would be more robustly handled.
if (!process.env.API_KEY) {
  // A simple alert for this demo. In a real app, you'd have a better UX.
  alert("API_KEY environment variable not set. Please set it to use the AI features.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateTransactionData = async (): Promise<Transaction[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a JSON array of 100 realistic bank transactions. 
      Each transaction object must have these keys: transaction_id (string, UUID format), customer_id (string), amount (number, between 5.00 and 15000.00), transaction_type ('debit' or 'credit'), timestamp (string, ISO 8601 format from the last 7 days), merchant (string, realistic name), location (string, city name), and is_fraud (boolean).
      
      Ensure about 5-8% of the transactions are marked as 'is_fraud: true'. Create believable fraudulent patterns, such as:
      1. Unusually high transaction amounts for a specific merchant.
      2. Multiple transactions for the same customer in a very short period from different locations.
      3. Transactions at odd hours (e.g., 3 AM).
      4. A mix of subtle and obvious fraud cases.
      
      Also include a few records with issues for cleaning, like a transaction with a negative amount and one with a missing merchant name.
      Return only the JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              transaction_id: { type: Type.STRING },
              customer_id: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              transaction_type: { type: Type.STRING, enum: ['debit', 'credit'] },
              timestamp: { type: Type.STRING },
              merchant: { type: Type.STRING },
              location: { type: Type.STRING },
              is_fraud: { type: Type.BOOLEAN },
            },
             required: ["transaction_id", "customer_id", "amount", "transaction_type", "timestamp", "merchant", "location", "is_fraud"]
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const transactions: Transaction[] = JSON.parse(jsonText);
    return transactions;

  } catch (error) {
    console.error("Error generating transaction data:", error);
    // You might want to return some mock data here as a fallback
    return [];
  }
};


export const detectFraudulentTransactions = async (transactions: Transaction[]): Promise<Transaction[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a fraud detection expert. Given the following JSON array of bank transactions, analyze them and identify which ones are likely fraudulent. Add two new keys to each object: 'predicted_is_fraud' (boolean) and 'fraud_reason' (string, explaining why it's suspicious, or "None" if not).
            
            Look for patterns like:
            - Unusually large amounts compared to a customer's typical spending.
            - Rapid, successive transactions.
            - Transactions from geographically distant locations in a short time.
            - High-value transactions with new merchants.
            
            Return the complete, updated JSON array. Do not omit any transactions.
            
            Transactions:
            ${JSON.stringify(transactions, null, 2)}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            transaction_id: { type: Type.STRING },
                            customer_id: { type: Type.STRING },
                            amount: { type: Type.NUMBER },
                            transaction_type: { type: Type.STRING, enum: ['debit', 'credit'] },
                            timestamp: { type: Type.STRING },
                            merchant: { type: Type.STRING },
                            location: { type: Type.STRING },
                            is_fraud: { type: Type.BOOLEAN },
                            predicted_is_fraud: { type: Type.BOOLEAN },
                            fraud_reason: { type: Type.STRING }
                        },
                        required: ["transaction_id", "customer_id", "amount", "transaction_type", "timestamp", "merchant", "location", "is_fraud", "predicted_is_fraud", "fraud_reason"]
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const analyzedTransactions: Transaction[] = JSON.parse(jsonText);
        return analyzedTransactions;

    } catch (error) {
        console.error("Error detecting fraud:", error);
        // Return original transactions with an error flag or handle appropriately
        return transactions.map(t => ({...t, predicted_is_fraud: undefined, fraud_reason: 'Analysis failed'}));
    }
};
