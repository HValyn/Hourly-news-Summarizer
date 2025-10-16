
import { GoogleGenAI } from "@google/genai";
import { NewsArticle, GroundingSource, NewsData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Function to clean the raw string response from Gemini
const cleanJsonString = (rawString: string): string => {
  // Find the start and end of the JSON array
  const startIndex = rawString.indexOf('[');
  const endIndex = rawString.lastIndexOf(']');
  
  if (startIndex === -1 || endIndex === -1) {
    // If no array is found, try to find an object
     const startObject = rawString.indexOf('{');
     const endObject = rawString.lastIndexOf('}');
     if(startObject !== -1 && endObject !== -1){
        return rawString.substring(startObject, endObject + 1);
     }
    throw new Error("Invalid format: No JSON array or object found in the response.");
  }
  
  return rawString.substring(startIndex, endIndex + 1);
};


export const fetchNewsSummaries = async (): Promise<NewsData> => {
  try {
    const prompt = `
      Provide a summary of the top 5 global news headlines from the last hour.
      Respond with ONLY a valid JSON array string in the format of:
      [{"title": "Headline Title 1", "summary": "A concise summary of the first news story."}, {"title": "Headline Title 2", "summary": "A concise summary of the second news story."}]
      Do not include any other text, explanations, or markdown formatting like \`\`\`json before or after the JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text;
    const cleanedText = cleanJsonString(rawText);

    let articles: NewsArticle[];
    try {
        articles = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("Failed to parse JSON:", cleanedText);
        throw new Error("The model returned data in an unexpected format. Please try again.");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => web?.uri && web.title)
      .reduce((acc: GroundingSource[], current) => {
        if (!acc.some(item => item.uri === current.uri)) {
          acc.push({ uri: current.uri, title: current.title });
        }
        return acc;
      }, []);

    return { articles, sources };
  } catch (error) {
    console.error("Error fetching news summaries:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch news from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching news.");
  }
};
