export type Locale = "en" | "ru"

type Dictionary = Record<string, string>

export const dictionaries: Record<Locale, Dictionary> = {
    en: {
        // Page header
        "page.title": "Create New Product",
        "page.subtitle": "Fill in the information below to add a new product to the CRM.",

        // Smart assistant card
        "assistant.title": "Smart Product Assistant",
        "assistant.description": "Enter a product name below and automatically generate all required fields.",
        "assistant.button": "Auto-Fill From Name",
        "assistant.button.loading": "Generating…",

        // Basic info
        "basic.title": "Basic Information",
        "basic.description": "Enter the core details of the product.",
        "basic.name": "Product Name",
        "basic.name.placeholder": "e.g. Nike Air Max",
        "basic.code": "Product Code / SKU",
        "basic.code.placeholder": "e.g. NIKE-AM-001",
        "basic.price": "Marketplace Price ($)",
        "basic.copy.success": "Copied!",
        "basic.copy.success.desc": "Product code copied to clipboard.",
        "basic.copy.fail": "Failed to copy",
        "basic.copy.fail.desc": "Your browser blocked clipboard access. Please copy manually.",
        "basic.copy.tooltip": "Copy SKU to clipboard",

        // Descriptions
        "desc.title": "Descriptions",
        "desc.short": "Short Description",
        "desc.short.placeholder": "Brief summary of the product…",
        "desc.long": "Long Description",
        "desc.long.placeholder": "Detailed product specifications and marketing copy…",

        // Location
        "location.title": "Location Settings",
        "location.address": "Address",
        "location.address.placeholder": "123 Main St, City, Country",
        "location.latitude": "Latitude",
        "location.longitude": "Longitude",

        // SEO
        "seo.title": "SEO Optimization",
        "seo.description": "Generate SEO fields automatically, or fill them in manually.",
        "seo.button": "Generate Optimized SEO",
        "seo.button.loading": "Generating…",
        "seo.field.title": "SEO Title",
        "seo.field.title.placeholder": "Search engine title",
        "seo.field.description": "SEO Description",
        "seo.field.description.placeholder": "Meta description for search engines",
        "seo.field.keywords": "SEO Keywords",
        "seo.field.keywords.placeholder": "keyword1, keyword2, keyword3",
        "seo.field.keywords.hint.prefix": "Comma-separated.",
        "seo.field.keywords.hint.suffix": "used. Stored as an array in the API payload.",
        "seo.characters": "characters",

        // Actions
        "actions.errors.prefix": "error",
        "actions.errors.prefix.plural": "errors",
        "actions.errors.suffix": "— fix them before submitting.",
        "actions.reset": "Reset",
        "actions.submit": "Create Product",
        "actions.submit.loading": "Creating…",
        "actions.required": "required",

        // Toasts
        "toast.autofill.missing": "Missing product name",
        "toast.autofill.missing.desc": "Enter a product name first, then use Auto-Fill.",
        "toast.autofill.success": "Auto-Fill complete",
        "toast.autofill.success.desc": "Product details generated successfully. Review before submitting.",
        "toast.autofill.fail": "Auto-Fill failed",
        "toast.seo.missing": "Missing product name",
        "toast.seo.missing.desc": "Enter a product name first, then generate SEO.",
        "toast.seo.success": "SEO generated",
        "toast.seo.success.desc": "Review and adjust the generated SEO fields before submitting.",
        "toast.seo.fail": "SEO generation failed",
        "toast.submit.success": "Product created",
        "toast.submit.success.desc": "The product was successfully added to the CRM.",
        "toast.submit.fail": "Failed to create product",

        // Locale toggle
        "locale.toggle": "Switch language",
    },
    ru: {
        // Page header
        "page.title": "Создание карточки товара",
        "page.subtitle": "Заполните информацию ниже, чтобы добавить новый товар в CRM.",

        // Smart assistant card
        "assistant.title": "Умный ассистент",
        "assistant.description": "Введите название товара - система автоматически заполнит все основные поля.",
        "assistant.button": "Заполнить автоматически",
        "assistant.button.loading": "Генерация…",

        // Basic info
        "basic.title": "Основная информация",
        "basic.description": "Укажите ключевые данные о товаре.",
        "basic.name": "Название товара",
        "basic.name.placeholder": "Например: Кроссовки Nike Air Max",
        "basic.code": "Артикул (SKU)",
        "basic.code.placeholder": "Например: NIKE-AM-001",
        "basic.price": "Цена на маркетплейсе (₽)",
        "basic.copy.success": "Скопировано!",
        "basic.copy.success.desc": "Артикул скопирован в буфер обмена.",
        "basic.copy.fail": "Ошибка копирования",
        "basic.copy.fail.desc": "Браузер заблокировал доступ к буферу обмена. Скопируйте вручную.",
        "basic.copy.tooltip": "Копировать артикул",

        // Descriptions
        "desc.title": "Описание товара",
        "desc.short": "Краткое описание",
        "desc.short.placeholder": "Лаконичное описание для карточки товара в каталоге…",
        "desc.long": "Полное описание",
        "desc.long.placeholder": "Характеристики, преимущества, состав, способ применения…",

        // Location
        "location.title": "Местоположение",
        "location.address": "Адрес",
        "location.address.placeholder": "ул. Зайцева 8, Казань, Россия",
        "location.latitude": "Широта",
        "location.longitude": "Долгота",

        // SEO
        "seo.title": "SEO-оптимизация",
        "seo.description": "Сгенерируйте SEO-параметры автоматически или заполните вручную.",
        "seo.button": "Сгенерировать SEO",
        "seo.button.loading": "Генерация…",
        "seo.field.title": "SEO-заголовок",
        "seo.field.title.placeholder": "Заголовок для поисковых систем",
        "seo.field.description": "SEO-описание",
        "seo.field.description.placeholder": "Мета-описание для поисковиков",
        "seo.field.keywords": "Ключевые слова",
        "seo.field.keywords.placeholder": "кроссовки, спортивная обувь, nike",
        "seo.field.keywords.hint.prefix": "Через запятую.",
        "seo.field.keywords.hint.suffix": "использов. Отправляется как массив в API.",
        "seo.characters": "символов",

        // Actions
        "actions.errors.prefix": "ошибка",
        "actions.errors.prefix.plural": "ошибок",
        "actions.errors.suffix": "— исправьте перед отправкой.",
        "actions.reset": "Сбросить",
        "actions.submit": "Создать товар",
        "actions.submit.loading": "Создание…",
        "actions.required": "обязательно",

        // Toasts
        "toast.autofill.missing": "Укажите название",
        "toast.autofill.missing.desc": "Введите название товара для автозаполнения.",
        "toast.autofill.success": "Готово",
        "toast.autofill.success.desc": "Поля заполнены автоматически. Проверьте перед отправкой.",
        "toast.autofill.fail": "Ошибка автозаполнения",
        "toast.seo.missing": "Укажите название",
        "toast.seo.missing.desc": "Введите название товара для генерации SEO.",
        "toast.seo.success": "SEO сгенерировано",
        "toast.seo.success.desc": "Проверьте и скорректируйте SEO-параметры перед отправкой.",
        "toast.seo.fail": "Ошибка генерации SEO",
        "toast.submit.success": "Товар создан",
        "toast.submit.success.desc": "Карточка товара успешно добавлена в CRM.",
        "toast.submit.fail": "Ошибка создания товара",

        // Locale toggle
        "locale.toggle": "Сменить язык",
    },
}
