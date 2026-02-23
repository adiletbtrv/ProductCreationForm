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
import { useLocale } from "@/lib/locale-context"

async function callGenerateAPI(
    productName: string,
    mode: "all" | "seo",
    locale: string
): Promise<AIGeneratedValues> {
    const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, mode, locale }),
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`)
    }

    return data as AIGeneratedValues
}

export function ProductForm() {
    const { toast } = useToast()
    const { locale, t } = useLocale()
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
            toast({ title: t("basic.copy.success"), description: t("basic.copy.success.desc") })
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Clipboard write failed:", err)
            toast({
                variant: "destructive",
                title: t("basic.copy.fail"),
                description: t("basic.copy.fail.desc"),
            })
        }
    }

    const handleAutoFill = async () => {
        const productName = form.getValues("name")
        if (!productName.trim()) {
            toast({
                variant: "destructive",
                title: t("toast.autofill.missing"),
                description: t("toast.autofill.missing.desc"),
            })
            return
        }
        setIsGeneratingAutoFill(true)
        try {
            const data = await callGenerateAPI(productName, "all", locale)
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
                title: t("toast.autofill.success"),
                description: t("toast.autofill.success.desc"),
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error"
            console.error("Auto-Fill failed:", message)
            toast({
                variant: "destructive",
                title: t("toast.autofill.fail"),
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
                title: t("toast.seo.missing"),
                description: t("toast.seo.missing.desc"),
            })
            return
        }

        setIsGeneratingSEO(true)
        try {
            const data = await callGenerateAPI(productName, "seo", locale)
            if (data.seo_title)
                form.setValue("seo_title", data.seo_title.slice(0, FIELD_LIMITS.SEO_TITLE_MAX).trim(), { shouldValidate: true })
            if (data.seo_description)
                form.setValue("seo_description", data.seo_description.slice(0, FIELD_LIMITS.SEO_DESC_MAX).trim(), { shouldValidate: true })
            if (data.seo_keywords)
                form.setValue("seo_keywords", data.seo_keywords.map(k => k.trim()).filter(Boolean).slice(0, FIELD_LIMITS.SEO_KEYWORDS_MAX), { shouldValidate: true })

            toast({
                title: t("toast.seo.success"),
                description: t("toast.seo.success.desc"),
            })
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error"
            console.error("SEO generation failed:", message)
            toast({
                variant: "destructive",
                title: t("toast.seo.fail"),
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
                title: t("toast.submit.success"),
                description: t("toast.submit.success.desc"),
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
                title: t("toast.submit.fail"),
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
                aria-label={t("page.title")}
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
                                    {t("assistant.title")}
                                </CardTitle>
                                <CardDescription className="text-indigo-600/70 dark:text-indigo-400/70">
                                    {t("assistant.description")}
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
                                {isGeneratingAutoFill ? t("assistant.button.loading") : t("assistant.button")}
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-primary" aria-hidden />
                            {t("basic.title")}
                        </CardTitle>
                        <CardDescription>{t("basic.description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("basic.name")} <span aria-label={t("actions.required")}>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("basic.name.placeholder")}
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
                                            {t("basic.code")} <span aria-label={t("actions.required")}>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder={t("basic.code.placeholder")}
                                                    maxLength={FIELD_LIMITS.CODE_MAX}
                                                    aria-required
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={handleCopySKU}
                                                    title={t("basic.copy.tooltip")}
                                                    aria-label={t("basic.copy.tooltip")}
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
                                            {t("basic.price")} <span aria-label={t("actions.required")}>*</span>
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
                            {t("desc.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="description_short"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("desc.short")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t("desc.short.placeholder")}
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
                                    <FormLabel>{t("desc.long")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t("desc.long.placeholder")}
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
                            {t("location.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("location.address")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t("location.address.placeholder")}
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
                                        <FormLabel>{t("location.latitude")}</FormLabel>
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
                                        <FormLabel>{t("location.longitude")}</FormLabel>
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
                                    {t("seo.title")}
                                </CardTitle>
                                <CardDescription>
                                    {t("seo.description")}
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
                                {isGeneratingSEO ? t("seo.button.loading") : t("seo.button")}
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4" aria-live="polite" aria-busy={isAIBusy}>
                        <FormField
                            control={form.control}
                            name="seo_title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("seo.field.title")}</FormLabel>
                                    {isAIBusy ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <FormControl>
                                            <Input
                                                placeholder={t("seo.field.title.placeholder")}
                                                maxLength={FIELD_LIMITS.SEO_TITLE_MAX}
                                                {...field}
                                            />
                                        </FormControl>
                                    )}
                                    <FormDescription>
                                        {(field.value ?? "").length}/{FIELD_LIMITS.SEO_TITLE_MAX} {t("seo.characters")}
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
                                    <FormLabel>{t("seo.field.description")}</FormLabel>
                                    {isAIBusy ? (
                                        <Skeleton className="h-[80px] w-full" />
                                    ) : (
                                        <FormControl>
                                            <Textarea
                                                placeholder={t("seo.field.description.placeholder")}
                                                className="resize-none"
                                                maxLength={FIELD_LIMITS.SEO_DESC_MAX}
                                                {...field}
                                            />
                                        </FormControl>
                                    )}
                                    <FormDescription>
                                        {(field.value ?? "").length}/{FIELD_LIMITS.SEO_DESC_MAX} {t("seo.characters")}
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
                                    <FormLabel>{t("seo.field.keywords")}</FormLabel>
                                    {isAIBusy ? (
                                        <Skeleton className="h-10 w-full" />
                                    ) : (
                                        <FormControl>
                                            <Input
                                                placeholder={t("seo.field.keywords.placeholder")}
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
                                        {t("seo.field.keywords.hint.prefix")} {field.value?.length ?? 0}/{FIELD_LIMITS.SEO_KEYWORDS_MAX} {t("seo.field.keywords.hint.suffix")}
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
                            {errorCount} {errorCount > 1 ? t("actions.errors.prefix.plural") : t("actions.errors.prefix")} {t("actions.errors.suffix")}
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
                            {t("actions.reset")}
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
                                    {t("actions.submit.loading")}
                                </>
                            ) : (
                                t("actions.submit")
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}