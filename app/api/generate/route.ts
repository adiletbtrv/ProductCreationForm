import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { productName, mode } = body // mode: "all" or "seo"

        if (!productName) {
            return NextResponse.json({ error: "Product name is required" }, { status: 400 })
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 })
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
        const isGeneratingAll = mode === "all"

        const prompt = isGeneratingAll
            ? `You are an expert e-commerce product manager. Given the product name "${productName}", generate realistic product details for an online marketplace. It must contain the fields exactly as defined in the schema. Make the text highly professional and appealing.`
            : `You are an expert SEO specialist. Given the product name "${productName}", generate highly optimized SEO title (max 60 chars), description (max 160 chars), and keywords for an online marketplace. Return the fields exactly as defined in the schema.`

        const schema = isGeneratingAll
            ? {
                type: Type.OBJECT,
                properties: {
                    code: { type: Type.STRING, description: "A realistic SKU or product code (e.g. LAPTOP-1234, WIDGET-xyz)" },
                    marketplace_price: { type: Type.NUMBER, description: "A realistic price in dollars" },
                    description_short: { type: Type.STRING, description: "A concise, engaging 1-2 sentence description" },
                    description_long: { type: Type.STRING, description: "A detailed product description highlighting features and benefits" },
                    seo_title: { type: Type.STRING },
                    seo_description: { type: Type.STRING },
                    seo_keywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["code", "marketplace_price", "description_short", "description_long", "seo_title", "seo_description", "seo_keywords"]
            }
            : {
                type: Type.OBJECT,
                properties: {
                    seo_title: { type: Type.STRING },
                    seo_description: { type: Type.STRING },
                    seo_keywords: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["seo_title", "seo_description", "seo_keywords"]
            }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7,
            }
        })

        const textResult = response.text
        if (!textResult) {
            throw new Error("No text returned from Gemini")
        }

        const data = JSON.parse(textResult)
        return NextResponse.json(data)
    } catch (error) {
        console.error("Gemini API Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}
