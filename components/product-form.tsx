"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Loader2,
    Sparkles,
    MapPin,
    Tag,
    FileText,
    Copy,
    CheckCircle2,
    Wand2,
    AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { productSchema, type ProductFormValues, defaultValues, type AIGeneratedValues } from "@/lib/schema"
import { FIELD_LIMITS } from "@/lib/constants"

async function callGenerateAPI(
    productName: string,
    mode: "all" | "seo"
): Promise<AIGeneratedValues> {
    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, mode }),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`)
    }

    return data as AIGeneratedValues
}

export function ProductForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false)
    const [isGeneratingAutoFill, setIsGeneratingAutoFill] = useState(false)
    const [copied, setCopied] = useState(false)

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues,
        mode: "onChange",
    })

    const handleCopySKU = async () => {
        const code = form.getValues("code")
        if (!code) return

        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            toast({ title: "Copied!", description: "Product code copied to clipboard." })
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Clipboard write failed:", err)
            toast({
                variant: "destructive",
                title: "Failed to copy",
                description: "Your browser blocked clipboard access. Please copy manually.",
            })
        }
    }

    const handleAutoFill = async () => {
        const productName = form.getValues("name")
        if (!productName.trim()) {
            toast({
                variant: "destructive",
                title: "Missing product name",
                description: "Enter a product name first, then use Auto-Fill.",
            })
            return
        }
        setIsGeneratingAutoFill(true)
        try {
            const data = await callGenerateAPI(productName, "all")
            if (data.code)
                form.setValue("code", data.code, { shouldValidate: true })
            if (data.marketplace_price !== undefined)
                form.setValue("marketplace_price", data.marketplace_price, { shouldValidate: true })
            if (data.description_short)
                form.setValue("description_short", data.description_short.slice(0, FIELD_LIMITS.SHORT_DESC_MAX).trim(), { shouldValidate: true })
            if (data.description_long)
                form.setValue("description_long", data.description_long.slice(0, FIELD_LIMITS.LONG_DESC_MAX).trim(), { shouldValidate: true })
            if (data.seo_title)
                form.setValue("seo_title", data.seo_title.slice(0, FIELD_LIMITS.SEO_TITLE_MAX).trim(), { shouldValidate: true })
            if (data.seo_description)
                form.setValue("seo_description", data.seo_description.slice(0, FIELD_LIMITS.SEO_DESC_MAX).trim(), { shouldValidate: true })
            if (data.seo_keywords)
                form.setValue("seo_keywords", data.seo_keywords.map(k => k.trim()).filter(Boolean).slice(0, FIELD_LIMITS.SEO_KEYWORDS_MAX), { shouldValidate: true })
            toast({
                title: "Auto-Fill complete",
                description: "Product details generated successfully. Review before submitting.",
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error"
            console.error("Auto-Fill failed:", message)
            toast({
                variant: "destructive",
                title: "Auto-Fill failed",
                description: message,
            })
        } finally {
            setIsGeneratingAutoFill(false)
        }
    }

    const handleGenerateSEO = async () => {
        const productName = form.getValues("name")
        if (!productName.trim()) {
            toast({
                variant: "destructive",
                title: "Missing product name",
                description: "Enter a product name first, then generate SEO.",
            })
            return
        }

        setIsGeneratingSEO(true)
        try {
            const data = await callGenerateAPI(productName, "seo")
            if (data.seo_title)
                form.setValue("seo_title", data.seo_title.slice(0, FIELD_LIMITS.SEO_TITLE_MAX).trim(), { shouldValidate: true })
            if (data.seo_description)
                form.setValue("seo_description", data.seo_description.slice(0, FIELD_LIMITS.SEO_DESC_MAX).trim(), { shouldValidate: true })
            if (data.seo_keywords)
                form.setValue("seo_keywords", data.seo_keywords.map(k => k.trim()).filter(Boolean).slice(0, FIELD_LIMITS.SEO_KEYWORDS_MAX), { shouldValidate: true })

            toast({
                title: "SEO generated",
                description: "Review and adjust the generated SEO fields before submitting.",
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error"
            console.error("SEO generation failed:", message)
            toast({
                variant: "destructive",
                title: "SEO generation failed",
                description: message,
            })
        } finally {
            setIsGeneratingSEO(false)
        }
    }

    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true)
        try {
            const response = await fetch(
                "https://app.tablecrm.com/api/v1/nomenclature/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify([data]),
                }
            )

            if (!response.ok) {
                const text = await response.text()
                console.error("CRM error response:", text)
                throw new Error(`CRM returned ${response.status}. Check console for details.`)
            }

            const text = await response.text()
            const result = text ? JSON.parse(text) : {}
            console.log("CRM response:", result)

            toast({
                title: "Product created",
                description: "The product was successfully added to the CRM.",
            })

            form.reset({
                ...defaultValues,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error"
            console.error("Product submission failed:", message)
            toast({
                variant: "destructive",
                title: "Failed to create product",
                description: message,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const isAIBusy = isGeneratingAutoFill || isGeneratingSEO
    const errorCount = Object.keys(form.formState.errors).length

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                aria-label="Create new product"
                noValidate
            >
                <Card className="border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden>
                        <Wand2 className="w-24 h-24 text-indigo-500" />
                    </div>
                    <CardHeader className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                    <Wand2 className="w-5 h-5" aria-hidden />
                                    Smart Product Assistant
                                </CardTitle>
                                <CardDescription className="text-indigo-600/70 dark:text-indigo-400/70">
                                    Enter a product name below and automatically generate all required fields.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/60 shadow-sm"
                                onClick={handleAutoFill}
                                disabled={isAIBusy}
                                aria-busy={isGeneratingAutoFill}
                            >
                                {isGeneratingAutoFill ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2 text-indigo-500" aria-hidden />
                                )}
                                {isGeneratingAutoFill ? "Generating…" : "Auto-Fill From Name"}
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary" aria-hidden />
                            Basic Information
                        </CardTitle>
                        <CardDescription>Enter the core details of the product.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Product Name <span aria-label="required">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Premium Widget"
                                                maxLength={FIELD_LIMITS.NAME_MAX}
                                                aria-required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {field.value.length}/{FIELD_LIMITS.NAME_MAX}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Product Code / SKU <span aria-label="required">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="e.g. WIDGET-001"
                                                    maxLength={FIELD_LIMITS.CODE_MAX}
                                                    aria-required
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleCopySKU}
                                                    title="Copy SKU to clipboard"
                                                    aria-label="Copy SKU to clipboard"
                                                    className="shrink-0"
                                                >
                                                    {copied ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden />
                                                    ) : (
                                                        <Copy className="w-4 h-4" aria-hidden />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="marketplace_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Marketplace Price ($) <span aria-label="required">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min={0}
                                                max={10_000_000}
                                                aria-required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <input type="hidden" {...form.register("unit")} />
                        <input type="hidden" {...form.register("cashback_type")} />
                        <input type="hidden" {...form.register("chatting_percent")} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" aria-hidden />
                            Descriptions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description_short"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Brief summary of the product…"
                                            className="resize-none"
                                            maxLength={FIELD_LIMITS.SHORT_DESC_MAX}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {(field.value ?? "").length}/{FIELD_LIMITS.SHORT_DESC_MAX}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description_long"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Long Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Detailed product specifications and marketing copy…"
                                            className="min-h-[120px]"
                                            maxLength={FIELD_LIMITS.LONG_DESC_MAX}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {(field.value ?? "").length}/{FIELD_LIMITS.LONG_DESC_MAX}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" aria-hidden />
                            Location Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123 Main St, City, Country"
                                            maxLength={FIELD_LIMITS.ADDRESS_MAX}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Latitude</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                min={-90}
                                                max={90}
                                                aria-describedby="latitude-hint"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription id="latitude-hint">-90 to 90</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Longitude</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                min={-180}
                                                max={180}
                                                aria-describedby="longitude-hint"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription id="longitude-hint">-180 to 180</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Sparkles className="w-5 h-5" aria-hidden />
                                    SEO Optimization
                                </CardTitle>
                                <CardDescription>
                                    Generate SEO fields automatically, or fill them in manually.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleGenerateSEO}
                                disabled={isAIBusy}
                                aria-busy={isGeneratingSEO}
                                className="w-full sm:w-auto"
                            >
                                {isGeneratingSEO ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" aria-hidden />
                                )}
                                {isGeneratingSEO ? "Generating…" : "Generate Optimized SEO"}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4" aria-live="polite" aria-busy={isAIBusy}>
                        <FormField
                            control={form.control}
                            name="seo_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Title</FormLabel>
                                    {isAIBusy ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <FormControl>
                                            <Input
                                                placeholder="Search engine title"
                                                maxLength={FIELD_LIMITS.SEO_TITLE_MAX}
                                                {...field}
                                            />
                                        </FormControl>
                                    )}
                                    <FormDescription>
                                        {(field.value ?? "").length}/{FIELD_LIMITS.SEO_TITLE_MAX} characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="seo_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Description</FormLabel>
                                    {isAIBusy ? (
                                        <Skeleton className="h-[80px] w-full" />
                                    ) : (
                                        <FormControl>
                                            <Textarea
                                                placeholder="Meta description for search engines"
                                                className="resize-none"
                                                maxLength={FIELD_LIMITS.SEO_DESC_MAX}
                                                {...field}
                                            />
                                        </FormControl>
                                    )}
                                    <FormDescription>
                                        {(field.value ?? "").length}/{FIELD_LIMITS.SEO_DESC_MAX} characters
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="seo_keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Keywords</FormLabel>
                                    {isAIBusy ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <FormControl>
                                            <Input
                                                placeholder="keyword1, keyword2, keyword3"
                                                value={field.value?.join(", ") ?? ""}
                                                onChange={(e) => {
                                                    const val = e.target.value
                                                        .split(",")
                                                        .map((k) => k.trim())
                                                        .filter(Boolean)
                                                    field.onChange(val)
                                                }}
                                                aria-describedby="keywords-hint"
                                            />
                                        </FormControl>
                                    )}
                                    <FormDescription id="keywords-hint">
                                        Comma-separated. {field.value?.length ?? 0}/{FIELD_LIMITS.SEO_KEYWORDS_MAX} used.
                                        Stored as an array in the API payload.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-10 pt-4 border-t">
                    {errorCount > 0 ? (
                        <p className="flex items-center gap-1.5 text-sm text-destructive font-medium" role="alert">
                            <AlertCircle className="w-4 h-4" aria-hidden />
                            {errorCount} error{errorCount > 1 ? "s" : ""} — fix them before submitting.
                        </p>
                    ) : (
                        <span />
                    )}

                    <div className="flex gap-4 w-full sm:w-auto justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset(defaultValues)}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !form.formState.isValid}
                            className="w-full sm:w-auto min-w-[150px]"
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden />
                                    Creating…
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}