import { describe, it, expect } from "@jest/globals"
import { productSchema, aiGeneratedSchema } from "../lib/schema"

describe("productSchema", () => {
    const validProduct = {
        name: "Premium Widget",
        code: "widget-001",
        marketplace_price: 49.99,
        type: "product" as const,
    }

    it("accepts a minimal valid product", () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
    })

    it("trims and uppercases the product code", () => {
        const result = productSchema.safeParse({ ...validProduct, code: "  widget-001  " })
        expect(result.success).toBe(true)
        if (result.success) expect(result.data.code).toBe("WIDGET-001")
    })

    it("trims whitespace from name", () => {
        const result = productSchema.safeParse({ ...validProduct, name: "  Premium Widget  " })
        expect(result.success).toBe(true)
        if (result.success) expect(result.data.name).toBe("Premium Widget")
    })

    it("rejects an empty name", () => {
        const result = productSchema.safeParse({ ...validProduct, name: "" })
        expect(result.success).toBe(false)
    })

    it("rejects a name that is too long", () => {
        const result = productSchema.safeParse({ ...validProduct, name: "a".repeat(201) })
        expect(result.success).toBe(false)
    })

    it("rejects a negative price", () => {
        const result = productSchema.safeParse({ ...validProduct, marketplace_price: -1 })
        expect(result.success).toBe(false)
    })

    it("rejects an unrealistically large price", () => {
        const result = productSchema.safeParse({ ...validProduct, marketplace_price: 10_000_001 })
        expect(result.success).toBe(false)
    })

    it("rejects latitude out of range", () => {
        const result = productSchema.safeParse({ ...validProduct, latitude: 91 })
        expect(result.success).toBe(false)
    })

    it("rejects longitude out of range", () => {
        const result = productSchema.safeParse({ ...validProduct, longitude: -181 })
        expect(result.success).toBe(false)
    })

    it("rejects SEO title longer than 60 chars", () => {
        const result = productSchema.safeParse({ ...validProduct, seo_title: "a".repeat(61) })
        expect(result.success).toBe(false)
    })

    it("rejects SEO description longer than 160 chars", () => {
        const result = productSchema.safeParse({ ...validProduct, seo_description: "a".repeat(161) })
        expect(result.success).toBe(false)
    })

    it("applies correct CRM defaults", () => {
        const result = productSchema.safeParse(validProduct)
        expect(result.success).toBe(true)
        if (result.success) {
            expect(result.data.category).toBe(2477)
            expect(result.data.global_category_id).toBe(127)
            expect(result.data.unit).toBe(116)
            expect(result.data.chatting_percent).toBe(4)
            expect(result.data.cashback_type).toBe("lcard_cashback")
        }
    })

    it("coerces string price to number", () => {
        const result = productSchema.safeParse({ ...validProduct, marketplace_price: "29.99" })
        expect(result.success).toBe(true)
        if (result.success) expect(result.data.marketplace_price).toBe(29.99)
    })

    it("accepts up to 20 SEO keywords", () => {
        const keywords = Array.from({ length: 20 }, (_, i) => `keyword${i}`)
        const result = productSchema.safeParse({ ...validProduct, seo_keywords: keywords })
        expect(result.success).toBe(true)
    })

    it("rejects more than 20 SEO keywords", () => {
        const keywords = Array.from({ length: 21 }, (_, i) => `keyword${i}`)
        const result = productSchema.safeParse({ ...validProduct, seo_keywords: keywords })
        expect(result.success).toBe(false)
    })
})

describe("aiGeneratedSchema", () => {
    it("accepts a full valid AI response", () => {
        const result = aiGeneratedSchema.safeParse({
            code: "WIDGET-001",
            marketplace_price: 49.99,
            description_short: "Great product",
            description_long: "Really great product with lots of features",
            seo_title: "Premium Widget | Best Price",
            seo_description: "Buy the best premium widget online.",
            seo_keywords: ["widget", "premium", "buy"],
        })
        expect(result.success).toBe(true)
    })

    it("accepts a partial response (all fields optional)", () => {
        const result = aiGeneratedSchema.safeParse({ seo_title: "Widget" })
        expect(result.success).toBe(true)
    })

    it("rejects a negative price from AI", () => {
        const result = aiGeneratedSchema.safeParse({ marketplace_price: -500 })
        expect(result.success).toBe(false)
    })

    it("truncates an SEO title over 60 chars from AI", () => {
        const result = aiGeneratedSchema.safeParse({ seo_title: "a".repeat(100) })
        expect(result.success).toBe(true)
        if (result.success) expect(result.data.seo_title).toHaveLength(60)
    })

    it("rejects empty string code from AI", () => {
        const result = aiGeneratedSchema.safeParse({ code: "" })
        expect(result.success).toBe(false)
    })
})