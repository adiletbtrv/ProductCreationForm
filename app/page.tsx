"use client"

import { ProductForm } from "@/components/product-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleToggle } from "@/components/locale-toggle"
import { LocaleProvider, useLocale } from "@/lib/locale-context"

function PageContent() {
    const { t } = useLocale()

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-end gap-2 mb-4">
                    <LocaleToggle />
                    <ThemeToggle />
                </div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                        {t("page.title")}
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {t("page.subtitle")}
                    </p>
                </div>
                <ProductForm />
            </div>
        </main>
    )
}

export default function Home() {
    return (
        <LocaleProvider>
            <PageContent />
        </LocaleProvider>
    )
}
