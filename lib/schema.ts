import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    code: z.string().min(1, { message: "Code is required" }),
    description_short: z.string().optional(),
    description_long: z.string().optional(),
    category: z.number().default(2477),
    global_category_id: z.number().default(127),
    marketplace_price: z.coerce.number().min(0, { message: "Price must be a positive number" }).default(0),
    address: z.string().optional(),
    latitude: z.coerce.number().optional().default(0),
    longitude: z.coerce.number().optional().default(0),
    type: z.literal("product").default("product"),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    unit: z.number().default(116),
    cashback_type: z.string().default("lcard_cashback"),
    seo_keywords: z.array(z.string()).default([]),
    chatting_percent: z.number().default(4),
})

export type ProductFormValues = z.infer<typeof productSchema>

export const defaultValues: Partial<ProductFormValues> = {
    name: "",
    code: "",
    description_short: "",
    description_long: "",
    category: 2477,
    global_category_id: 127,
    marketplace_price: 0,
    address: "",
    latitude: 0,
    longitude: 0,
    type: "product",
    seo_title: "",
    seo_description: "",
    unit: 116,
    cashback_type: "lcard_cashback",
    seo_keywords: [],
    chatting_percent: 4,
}
