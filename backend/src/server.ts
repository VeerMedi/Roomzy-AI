import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { clerkMiddleware, requireAuth } from '@clerk/express';

dotenv.config(); // Loads .env from the root of the backend directory

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(clerkMiddleware());

const port = process.env.PORT || 3200;

// Re-using types
export enum UserMode {
    RENT = 'Rent',
    OWN = 'Own'
}

export interface RoomData {
    image: string | null;
    city: string;
    budget: string;
    style: string;
    mode: UserMode;
    orientation: string;
}

const cleanBase64 = (b64: string) => b64.includes(',') ? b64.split(',')[1] : b64;

// Freepik Service Logic
const generateImageWithFreepik = async (prompt: string, style: string): Promise<string> => {
    const apiKey = process.env.VITE_FREEPIK_API_KEY || process.env.FREEPIK_API_KEY;
    if (!apiKey) throw new Error("Freepik API key not found");

    try {
        const response = await fetch("https://api.magnific.com/v1/ai/mystic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-freepik-api-key": apiKey
            },
            body: JSON.stringify({
                prompt: prompt,
                styling: {
                    style: style.toLowerCase().includes('realistic') ? 'realistic' : 'anime'
                },
                number_of_images: 1,
                aspect_ratio: "classic_4_3"
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = response.statusText;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // If not JSON, use the raw text if available
                errorMessage = errorText || errorMessage;
            }
            throw new Error(`Freepik API error (${response.status}): ${errorMessage}`);
        }

        const data: any = await response.json();
        if (data.data?.[0]?.base64) {
            return `data:image/png;base64,${data.data[0].base64}`;
        } else if (data.data?.[0]?.url) {
            return data.data[0].url;
        } else {
            throw new Error("No image data returned from Freepik");
        }
    } catch (error) {
        console.error("Freepik generation failed:", error);
        throw error;
    }
};

// Perplexity Service Logic
const searchShoppingLinks = async (itemName: string, city: string): Promise<any> => {
    const perplexityKey = process.env.VITE_PERPLEXITY_API_KEY || process.env.PERPLEXITY_API_KEY;
    const openRouterKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    const isDirect = perplexityKey && perplexityKey !== "YOUR_PERPLEXITY_API_KEY_HERE";
    const apiKey = isDirect ? perplexityKey : (openRouterKey?.startsWith("sk-or-") ? openRouterKey : null);

    if (!apiKey) return null;

    const baseUrl = isDirect ? "https://api.perplexity.ai" : "https://openrouter.ai/api/v1";
    const model = isDirect ? "sonar-pro" : "perplexity/sonar-pro";

    const prompt = `Find a specific, buyable shopping link for: "${itemName}" available in India.
    STRICT RULES:
    1. The link MUST be a direct product page or a specific search result page.
    2. DO NOT return generic homepages.
    3. Return ONLY a JSON object: { "retailLink": "specific_url", "retailPrice": price_number }`;

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                ...(isDirect ? {} : { "HTTP-Referer": "http://localhost:3000", "X-Title": "Roomzy AI" })
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) return null;

        const data: any = await response.json();
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            let link = parsed.retailLink || "";
            if (link && !link.startsWith('http')) link = 'https://' + link;
            if (link.includes("pepperfry.com") && link.split("pepperfry.com")[1]?.length <= 1) {
                link = `https://www.pepperfry.com/site_product/search?q=${encodeURIComponent(itemName)}`;
            }
            parsed.retailLink = link;
            return parsed;
        }
        return null;
    } catch (error) {
        return null;
    }
};

app.post('/api/generate', async (req, res) => {
    try {
        const roomData: RoomData = req.body;
        let geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
        geminiKey = geminiKey.replace(/['"]/g, '').trim();

        if (!geminiKey) return res.status(400).json({ error: "Gemini API Key missing" });

        const isOpenRouter = geminiKey.startsWith("sk-or-");
        const originalImageBase64 = cleanBase64(roomData.image || "");

        // 1. Image Generation
        const designPrompt = `Photorealistic interior design render. Style: ${roomData.style}. ${roomData.mode === 'Rent' ? 'Rental friendly.' : 'Full renovation.'} Location: ${roomData.city}. Maintain camera angle.`;

        let generatedImage = "";
        let isFallback = false;
        try {
            generatedImage = await generateImageWithFreepik(designPrompt, roomData.style);
        } catch (e) {
            generatedImage = roomData.image || "";
            isFallback = true;
        }

        // 2. Analysis
        const analysisPrompt = `Analyze NEW DESIGN (${roomData.style}). Output exact JSON: { "vastu": { "score": 1-10, "summary": "...", "issues": [...] }, "products": [{ "name": "...", "retailPrice": 0, "carpenterPrice": 0, "carpenterNotes": "..." }] }. Location: ${roomData.city}. Budget: ${roomData.budget}.`;

        let analysisData;
        if (isOpenRouter) {
            const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${geminiKey}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "google/gemini-3.1-flash-lite",
                    messages: [{ role: "user", content: [{ type: "text", text: analysisPrompt }, { type: "image_url", image_url: { url: generatedImage } }] }],
                    response_format: { type: "json_object" }
                })
            });
            const data: any = await resp.json();
            if (!resp.ok || !data.choices) {
                console.error("OpenRouter error:", JSON.stringify(data));
                throw new Error(data.error?.message || "Invalid response from OpenRouter");
            }
            analysisData = JSON.parse(data.choices[0].message.content);
        } else {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const imgData = generatedImage.startsWith('data:') ? cleanBase64(generatedImage) : originalImageBase64;
            const result = await model.generateContent([analysisPrompt, { inlineData: { mimeType: "image/jpeg", data: imgData } }]);
            analysisData = JSON.parse(result.response.text().replace(/```json\n?|\n?```/g, "").trim());
        }

        // 3. Shopping Links
        const productsFromAI = analysisData.products || [];
        const productsWithLinks = await Promise.all(productsFromAI.map(async (item: any) => {
            const scraped = await searchShoppingLinks(item.name, roomData.city);
            if (scraped) return { ...item, retailLink: scraped.retailLink, retailPrice: scraped.retailPrice || item.retailPrice };
            return { ...item, retailLink: `https://www.pepperfry.com/site_product/search?q=${encodeURIComponent(item.name)}` };
        }));

        res.json({
            generatedImage,
            vastu: analysisData.vastu || { score: 5, summary: "Incomplete", issues: [] },
            products: productsWithLinks,
            totalRetail: productsWithLinks.reduce((a: number, b: any) => a + (Number(b.retailPrice) || 0), 0),
            totalCarpenter: productsWithLinks.reduce((a: number, b: any) => a + (Number(b.carpenterPrice) || 0), 0),
            isFallback
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
