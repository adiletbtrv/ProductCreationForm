"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles, MapPin, Tag, FileText, Copy, CheckCircle2, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { productSchema, type ProductFormValues, defaultValues } from "@/lib/schema"

export function ProductForm() {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGeneratingSEO, setIsGeneratingSEO] = useState(false)
    const [isGeneratingAutoFill, setIsGeneratingAutoFill] = useState(false)
    const [copied, setCopied] = useState(false)

    // Using mode: 'onChange' for on-the-fly validation
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
            toast({
                title: "Copied!",
                description: "Product Code copied to clipboard.",
            })
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Failed to copy",
                description: "Could not copy text to clipboard.",
            })
        }
    }

    // Smart Auto-Fill Helper
    const handleAutoFill = async () => {
        const productName = form.getValues("name")
        if (!productName) {
            toast({
                variant: "destructive",
                title: "Missing Name",
                description: "Please enter a product name first before using AI Auto-Fill.",
            })
            return
        }

        setIsGeneratingAutoFill(true)

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName, mode: "all" })
            });

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to generate AI data")
            }

            const data = await res.json()

            // Update form fields automatically based on strictly typed response
            form.setValue("code", data.code || "", { shouldValidate: true })
            form.setValue("description_short", data.description_short || "", { shouldValidate: true })
            form.setValue("description_long", data.description_long || "", { shouldValidate: true })
            form.setValue("marketplace_price", data.marketplace_price || 0, { shouldValidate: true })
            form.setValue("seo_title", data.seo_title || "", { shouldValidate: true })
            form.setValue("seo_description", data.seo_description || "", { shouldValidate: true })
            form.setValue("seo_keywords", data.seo_keywords || [], { shouldValidate: true })

            toast({
                title: "Auto-Fill Complete",
                description: "Successfully filled out product details using Gemini AI.",
            })

        } catch (error) {
            console.error("Auto-Fill Error:", error)
            toast({
                variant: "destructive",
                title: "AI Generation Failed",
                description: "There was a problem generating the product details. Please try again or fill manually.",
            })
        } finally {
            setIsGeneratingAutoFill(false)
        }
    }


    // Auto generate SEO parameters
    const handleGenerateSEO = async () => {
        const productName = form.getValues("name")
        if (!productName) {
            toast({
                variant: "destructive",
                title: "Missing Name",
                description: "Please enter a product name first before generating SEO.",
            })
            return
        }

        setIsGeneratingSEO(true)

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName, mode: "seo" })
            });

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to generate SEO")
            }

            const data = await res.json()

            form.setValue("seo_title", data.seo_title || "", { shouldValidate: true })
            form.setValue("seo_description", data.seo_description || "", { shouldValidate: true })
            form.setValue("seo_keywords", data.seo_keywords || [], { shouldValidate: true })

            toast({
                title: "SEO Generated",
                description: "Successfully fetched optimized SEO fields via Gemini AI.",
            })
        } catch (error) {
            console.error("SEO Generation Error:", error)
            toast({
                variant: "destructive",
                title: "AI Generation Failed",
                description: "There was a problem generating SEO fields. Please try manually.",
            })
        } finally {
            setIsGeneratingSEO(false)
        }
    }



    const onSubmit = async (data: ProductFormValues) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("https://app.tablecrm.com/api/v1/nomenclature/?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([data])
            })

            if (!response.ok) {
                throw new Error("Failed to create product")
            }

            toast({
                title: "Success",
                description: "Product created successfully in CRM!",
            })

            form.reset()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error Creating Product",
                description: "There was a problem communicating with the CRM API. Please check your token or try again later.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* AI Header */}
                <Card className="border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wand2 className="w-24 h-24 text-indigo-500" />
                    </div>
                    <CardHeader className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                                    <Wand2 className="w-5 h-5" />
                                    Smart Product Assistant
                                </CardTitle>
                                <CardDescription className="text-indigo-600/70 dark:text-indigo-400/70">
                                    Enter a product name below and automatically generate all required fields
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-800/60 shadow-sm"
                                onClick={handleAutoFill}
                                disabled={isGeneratingAutoFill}
                            >
                                {isGeneratingAutoFill ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                                )}
                                Auto-Fill From Name
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                {/* Basic info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary" />
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
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. Premium Widget"
                                                {...field}
                                                className={form.formState.errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Code / SKU</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="e.g. WIDGET-001"
                                                    {...field}
                                                    className={form.formState.errors.code ? 'border-destructive focus-visible:ring-destructive' : ''}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleCopySKU}
                                                    title="Copy SKU"
                                                    className="shrink-0"
                                                >
                                                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
                                        <FormLabel>Marketplace Price ($)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                className={form.formState.errors.marketplace_price ? 'border-destructive focus-visible:ring-destructive' : ''}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Hidden fields mapped from payload requirements */}
                            <input type="hidden" {...form.register("unit")} />
                            <input type="hidden" {...form.register("cashback_type")} />
                            <input type="hidden" {...form.register("chatting_percent")} />
                        </div>
                    </CardContent>
                </Card>

                {/* Descriptions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
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
                                            placeholder="Brief summary of the product..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
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
                                            placeholder="Detailed product specifications and marketing copy..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Location and meta */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
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
                                        <Input placeholder="123 Main St, City, Country" {...field} />
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
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
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
                                            <Input type="number" step="any" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* AI SEO Generation */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Sparkles className="w-5 h-5" />
                                    SEO Optimization
                                </CardTitle>
                                <CardDescription>
                                    Click the button to automatically generate SEO fields based on the product name.
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="default"
                                onClick={handleGenerateSEO}
                                disabled={isGeneratingSEO || isGeneratingAutoFill}
                                className="w-full sm:w-auto"
                            >
                                {isGeneratingSEO ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" />
                                )}
                                Generate Optimized SEO
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="seo_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Title</FormLabel>
                                    {isGeneratingSEO || isGeneratingAutoFill ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <FormControl>
                                            <Input placeholder="Search Engine Title" {...field} />
                                        </FormControl>
                                    )}
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
                                    {isGeneratingSEO || isGeneratingAutoFill ? (
                                        <Skeleton className="h-[80px] w-full" />
                                    ) : (
                                        <FormControl>
                                            <Textarea placeholder="Meta description for search engines" className="resize-none" {...field} />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="seo_keywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SEO Keywords (comma separated)</FormLabel>
                                    {isGeneratingSEO || isGeneratingAutoFill ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <FormControl>
                                            <Input
                                                placeholder="keyword1, keyword2"
                                                value={field.value?.join(", ")}
                                                onChange={(e) => {
                                                    const val = e.target.value.split(",").map(k => k.trim()).filter(Boolean)
                                                    field.onChange(val)
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                    <CardDescription className="text-xs mt-1">
                                        These keywords will be included in the API payload as an array.
                                    </CardDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-10 pt-4 border-t">
                    <p className="text-sm text-muted-foreground w-full text-center sm:text-left">
                        {Object.keys(form.formState.errors).length > 0 && (
                            <span className="text-destructive font-medium">Please fix the errors above before submitting.</span>
                        )}
                    </p>
                    <div className="flex gap-4 w-full sm:w-auto justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={isSubmitting || !form.formState.isValid} className="w-full sm:w-auto min-w-[150px]">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
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
