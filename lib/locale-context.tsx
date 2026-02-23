"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { dictionaries, type Locale } from "@/lib/dictionaries"

const STORAGE_KEY = "preferred-locale"
const DEFAULT_LOCALE: Locale = "en"

interface LocaleContextValue {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(): Locale {
    if (typeof window === "undefined") return DEFAULT_LOCALE
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "en" || stored === "ru") return stored
    return DEFAULT_LOCALE
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setLocaleState(getInitialLocale())
        setMounted(true)
    }, [])

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next)
        localStorage.setItem(STORAGE_KEY, next)
        document.documentElement.lang = next
    }, [])

    const t = useCallback(
        (key: string): string => {
            return dictionaries[locale][key] ?? key
        },
        [locale]
    )

    const value: LocaleContextValue = {
        locale: mounted ? locale : DEFAULT_LOCALE,
        setLocale,
        t: mounted ? t : (key: string) => dictionaries[DEFAULT_LOCALE][key] ?? key,
    }

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    )
}

export function useLocale(): LocaleContextValue {
    const ctx = useContext(LocaleContext)
    if (!ctx) {
        throw new Error("useLocale must be used within a LocaleProvider")
    }
    return ctx
}
