"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"

export function LocaleToggle() {
    const { locale, setLocale, t } = useLocale()

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setLocale(locale === "en" ? "ru" : "en")}
            title={t("locale.toggle")}
            aria-label={t("locale.toggle")}
        >
            <span className="text-xs font-semibold uppercase">{locale === "en" ? "RU" : "EN"}</span>
            <span className="sr-only">{t("locale.toggle")}</span>
        </Button>
    )
}
