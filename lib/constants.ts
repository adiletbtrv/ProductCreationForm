export const CRM_DEFAULTS = {
    CATEGORY_ID: 2477,
    GLOBAL_CATEGORY_ID: 127,
    UNIT_ID: 116,
    CHATTING_PERCENT: 4,
    CASHBACK_TYPE: "lcard_cashback",
    DEFAULT_LATITUDE: 0,
    DEFAULT_LONGITUDE: 0,
} as const

export const FIELD_LIMITS = {
    NAME_MAX: 200,
    CODE_MAX: 100,
    SHORT_DESC_MAX: 500,
    LONG_DESC_MAX: 5000,
    SEO_TITLE_MAX: 60,
    SEO_DESC_MAX: 160,
    SEO_KEYWORDS_MAX: 20,
    ADDRESS_MAX: 300,
} as const

export const RATE_LIMIT = {
    MAX_REQUESTS: 10,
    WINDOW_MS: 60_000,
} as const