import { z } from "zod"
import { CRM_DEFAULTS, FIELD_LIMITS } from "@/lib/constants"

export const productSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Name is required" })
        .max(FIELD_LIMITS.NAME_MAX, { message: `Name must be ${FIELD_LIMITS.NAME_MAX} characters or fewer` })
        .transform((v) => v.trim()),

    code: z
        .string()
        .min(1, { message: "Product code is required" })
        .max(FIELD_LIMITS.CODE_MAX, { message: `Code must be ${FIELD_LIMITS.CODE_MAX} characters or fewer` })
        .transform((v) => v.trim().toUpperCase()),

    description_short: z
        .string()
        .max(FIELD_LIMITS.SHORT_DESC_MAX, { message: `Short description must be ${FIELD_LIMITS.SHORT_DESC_MAX} characters or fewer` })
        .transform((v) => v.trim())
        .optional()
        .default(""),

    description_long: z
        .string()
        .max(FIELD_LIMITS.LONG_DESC_MAX, { message: `Long description must be ${FIELD_LIMITS.LONG_DESC_MAX} characters or fewer` })
        .transform((v) => v.trim())
        .optional()
        .default(""),

    category: z.number().default(CRM_DEFAULTS.CATEGORY_ID),
    global_category_id: z.number().default(CRM_DEFAULTS.GLOBAL_CATEGORY_ID),

    marketplace_price: z.coerce
        .number()
        .min(0, { message: "Price must be 0 or greater" })
        .max(10_000_000, { message: "Price seems unrealistically high" })
        .default(0),

    address: z
        .string()
        .max(FIELD_LIMITS.ADDRESS_MAX, { message: `Address must be ${FIELD_LIMITS.ADDRESS_MAX} characters or fewer` })
        .transform((v) => v.trim())
        .optional()
        .default(""),

    latitude: z.coerce
        .number()
        .min(-90, { message: "Latitude must be between -90 and 90" })
        .max(90, { message: "Latitude must be between -90 and 90" })
        .optional()
        .default(CRM_DEFAULTS.DEFAULT_LATITUDE),

    longitude: z.coerce
        .number()
        .min(-180, { message: "Longitude must be between -180 and 180" })
        .max(180, { message: "Longitude must be between -180 and 180" })
        .optional()
        .default(CRM_DEFAULTS.DEFAULT_LONGITUDE),

    type: z.literal("product").default("product"),

    seo_title: z
        .string()
        .max(FIELD_LIMITS.SEO_TITLE_MAX, { message: `SEO title must be ${FIELD_LIMITS.SEO_TITLE_MAX} characters or fewer` })
        .transform((v) => v.trim())
        .optional()
        .default(""),

    seo_description: z
        .string()
        .max(FIELD_LIMITS.SEO_DESC_MAX, { message: `SEO description must be ${FIELD_LIMITS.SEO_DESC_MAX} characters or fewer` })
        .transform((v) => v.trim())
        .optional()
        .default(""),

    seo_keywords: z
        .array(z.string().min(1).max(50))
        .max(FIELD_LIMITS.SEO_KEYWORDS_MAX, { message: `Maximum ${FIELD_LIMITS.SEO_KEYWORDS_MAX} keywords allowed` })
        .default([]),

    unit: z.number().default(CRM_DEFAULTS.UNIT_ID),
    cashback_type: z.string().default(CRM_DEFAULTS.CASHBACK_TYPE),
    chatting_percent: z.number().default(CRM_DEFAULTS.CHATTING_PERCENT),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const defaultValues: ProductFormValues = {
    name: "",
    code: "",
    description_short: "",
    description_long: "",
    category: CRM_DEFAULTS.CATEGORY_ID,
    global_category_id: CRM_DEFAULTS.GLOBAL_CATEGORY_ID,
    marketplace_price: 0,
    address: "",
    latitude: CRM_DEFAULTS.DEFAULT_LATITUDE,
    longitude: CRM_DEFAULTS.DEFAULT_LONGITUDE,
    type: "product",
    seo_title: "",
    seo_description: "",
    unit: CRM_DEFAULTS.UNIT_ID,
    cashback_type: CRM_DEFAULTS.CASHBACK_TYPE,
    seo_keywords: [],
    chatting_percent: CRM_DEFAULTS.CHATTING_PERCENT,
}

export const aiGeneratedSchema = z.object({
    code: z.string().min(1).max(FIELD_LIMITS.CODE_MAX).optional(),
    marketplace_price: z.number().min(0).max(10_000_000).optional(),
    description_short: z
        .string()
        .transform((v) => v.slice(0, FIELD_LIMITS.SHORT_DESC_MAX))
        .optional(),

    description_long: z
        .string()
        .transform((v) => v.slice(0, FIELD_LIMITS.LONG_DESC_MAX))
        .optional(),

    seo_title: z
        .string()
        .transform((v) => v.slice(0, FIELD_LIMITS.SEO_TITLE_MAX).trim())
        .optional(),

    seo_description: z
        .string()
        .transform((v) => v.slice(0, FIELD_LIMITS.SEO_DESC_MAX).trim())
        .optional(),

    seo_keywords: z
        .array(z.string())
        .transform((arr) =>
            arr
                .map((k) => k.trim())
                .filter(Boolean)
                .slice(0, FIELD_LIMITS.SEO_KEYWORDS_MAX)
        )
        .optional(),
})

export type AIGeneratedValues = z.infer<typeof aiGeneratedSchema>