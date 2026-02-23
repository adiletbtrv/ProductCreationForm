import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI, Type } from "@google/genai"
import { aiGeneratedSchema } from "@/lib/schema"
import { FIELD_LIMITS } from "@/lib/constants"

export async function POST(req: NextRequest) {
    let body: unknown
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("productName" in body) ||
        typeof (body as Record<string, unknown>).productName !== "string"
    ) {
        return NextResponse.json({ error: "productName (string) is required" }, { status: 400 })
    }

    const { productName, mode, locale } = body as { productName: string; mode?: string; locale?: string }
    const trimmedName = productName.trim()
    const lang = locale === "ru" ? "ru" : "en"

    if (!trimmedName) {
        return NextResponse.json({ error: "productName cannot be empty" }, { status: 400 })
    }

    if (trimmedName.length > FIELD_LIMITS.NAME_MAX) {
        return NextResponse.json(
            { error: `productName must be ${FIELD_LIMITS.NAME_MAX} characters or fewer` },
            { status: 400 }
        )
    }

    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY environment variable is not set")
        return NextResponse.json(
            { error: "Generation service is not configured. Please contact support." },
            { status: 503 }
        )
    }

    const isGeneratingAll = mode === "all"
    const langInstruction = lang === "ru"
        ? "Respond entirely in Russian. All text fields must be written in Russian."
        : "Respond entirely in English. All text fields must be written in English."

    const prompt = isGeneratingAll
        ? `You are an expert e-commerce product manager. Given the product name "${trimmedName}", generate realistic product details for an online marketplace. It must contain the fields exactly as defined in the schema. Make the text highly professional and appealing. ${langInstruction}`
        : `You are an expert SEO specialist. Given the product name "${trimmedName}", generate highly optimized SEO title (max ${FIELD_LIMITS.SEO_TITLE_MAX} chars), description (max ${FIELD_LIMITS.SEO_DESC_MAX} chars), and keywords for an online marketplace. Return the fields exactly as defined in the schema. ${langInstruction}`

    const schema = isGeneratingAll
        ? {
            type: Type.OBJECT,
            properties: {
                code: {
                    type: Type.STRING,
                    description: `A realistic SKU or product code (e.g. LAPTOP-1234). Max ${FIELD_LIMITS.CODE_MAX} chars.`,
                },
                marketplace_price: {
                    type: Type.NUMBER,
                    description: "A realistic price in dollars between 0 and 10,000,000",
                },
                description_short: {
                    type: Type.STRING,
                    description: `Concise, engaging 1-2 sentence description. Max ${FIELD_LIMITS.SHORT_DESC_MAX} chars.`,
                },
                description_long: {
                    type: Type.STRING,
                    description: `Detailed product description highlighting features and benefits. Max ${FIELD_LIMITS.LONG_DESC_MAX} chars.`,
                },
                seo_title: {
                    type: Type.STRING,
                    description: `SEO title, max ${FIELD_LIMITS.SEO_TITLE_MAX} characters`,
                },
                seo_description: {
                    type: Type.STRING,
                    description: `SEO meta description, max ${FIELD_LIMITS.SEO_DESC_MAX} characters`,
                },
                seo_keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: `Array of SEO keywords, max ${FIELD_LIMITS.SEO_KEYWORDS_MAX} items`,
                },
            },
            required: [
                "code",
                "marketplace_price",
                "description_short",
                "description_long",
                "seo_title",
                "seo_description",
                "seo_keywords",
            ],
        }
        : {
            type: Type.OBJECT,
            properties: {
                seo_title: {
                    type: Type.STRING,
                    description: `SEO title, max ${FIELD_LIMITS.SEO_TITLE_MAX} characters`,
                },
                seo_description: {
                    type: Type.STRING,
                    description: `SEO meta description, max ${FIELD_LIMITS.SEO_DESC_MAX} characters`,
                },
                seo_keywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
            required: ["seo_title", "seo_description", "seo_keywords"],
        }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.7,
            },
        })

        const textResult = response.text
        if (!textResult) {
            throw new Error("Service returned an empty response")
        }

        // Safe JSON parse
        let rawData: unknown
        try {
            rawData = JSON.parse(textResult)
        } catch {
            console.error("Failed to parse JSON response:", textResult.slice(0, 200))
            return NextResponse.json(
                { error: "Service returned malformed data. Please try again." },
                { status: 502 }
            )
        }

        const validation = aiGeneratedSchema.safeParse(rawData)
        if (!validation.success) {
            console.error("Response failed validation:", validation.error.flatten())
            return NextResponse.json(
                { error: "Service returned unexpected data. Please try again." },
                { status: 502 }
            )
        }

        return NextResponse.json(validation.data)
    } catch (error) {
        if (error instanceof Error) {
            const msg = error.message.toLowerCase()
            if (msg.includes("quota") || msg.includes("rate")) {
                return NextResponse.json(
                    { error: "Service quota exceeded. Please try again later." },
                    { status: 503 }
                )
            }
            if (msg.includes("api key") || msg.includes("unauthorized")) {
                console.error("API key error:", error.message)
                return NextResponse.json(
                    { error: "Service configuration error. Please contact support." },
                    { status: 503 }
                )
            }
            console.error("Generation error:", error.message)
        } else {
            console.error("Unknown generation error:", error)
        }

        return NextResponse.json(
            { error: "Generation failed. Please try again or fill the fields manually." },
            { status: 500 }
        )
    }
}