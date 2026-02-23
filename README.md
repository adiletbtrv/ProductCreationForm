<h1 align="center">TableCRM — Product Creation Form</h1>

<img width="4098" height="2304" alt="Screen Shot 2026-02-21 at 23 57 14" src="https://github.com/user-attachments/assets/6620e656-a66b-4af8-832b-ea754a84ed94" />
<img width="4098" height="2304" alt="Screen Shot 2026-02-21 at 23 57 26" src="https://github.com/user-attachments/assets/e408d304-8d7e-4751-8a50-50825af1041e" />

<p align="center">
  A production-ready product listing form for a marketplace CRM, built with Next.js 14, TypeScript, and shadcn/ui.
</p>

---

## Features

- **Smart Auto-Fill** — Enter a product name and automatically generate SKU, price, short and long descriptions, and SEO fields. Works with both English and Russian product names.
- **SEO Generation** — One-click generation of an optimized SEO title (max 60 chars), meta description (max 160 chars), and keyword list.
- **Bilingual Interface (EN / RU)** — Full English and Russian localization with a language toggle button. Persists across sessions via localStorage. Generated content language follows the selected UI language.
- **Real-time Validation** — Field-level feedback on every keystroke via react-hook-form and Zod. Character counters on text fields. Coordinates and price range validation.
- **Dark / Light Mode** — System-aware theme with manual toggle powered by `next-themes`.
- **Copy SKU** — One-click copy of the product code to clipboard with confirmation feedback.
- **Secure Server-Side Generation** — The API key is never exposed to the browser. All generation requests go through a Next.js API route.
- **Security Headers** — Strict security headers applied globally: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, and `Permissions-Policy`.
- **CRM Integration** — Submits directly to the TableCRM REST API with the exact required payload shape.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router, SSR) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS |
| Forms | react-hook-form + Zod |
| Text Generation | Google Gemini 2.5 Flash (`@google/genai`) |
| Theming | next-themes |
| Testing | Jest + ts-jest |
| Deployment | Vercel |

---

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # Server-side generation endpoint
│   ├── globals.css
│   ├── layout.tsx              # Root layout with ThemeProvider
│   └── page.tsx                # Main page with LocaleProvider
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── locale-toggle.tsx       # EN / RU language switch button
│   ├── product-form.tsx        # Main product creation form
│   ├── theme-provider.tsx      # next-themes wrapper
│   └── theme-toggle.tsx        # Dark / light mode button
├── lib/
│   ├── constants.ts            # CRM defaults and field limits
│   ├── dictionaries.ts         # EN and RU translation strings
│   ├── locale-context.tsx      # Locale context, provider, and useLocale hook
│   ├── schema.ts               # Zod schemas: productSchema, aiGeneratedSchema
│   └── utils.ts                # Tailwind class utility
├── __tests__/
│   └── schema.test.ts          # Unit tests for Zod schemas
├── next.config.js              # Security headers configuration
├── .env.example                # Environment variable template
└── jest.config.js              # Jest configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Google Gemini API key — obtain one at [aistudio.google.com](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/adiletbtrv/ProductCreationForm.git
cd ProductCreationForm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Open .env and set GEMINI_API_KEY to your key

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the project root based on `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Important:** Never commit your `.env` file. It is already excluded via `.gitignore`.

---

## Internationalization

The interface supports English and Russian. Strings are defined in `lib/dictionaries.ts` organized by section (page header, form fields, buttons, toasts, validation messages). The locale is stored in `localStorage` and resolved on mount to avoid hydration mismatches.

Generated content language is controlled by a `locale` parameter sent to the server-side route, which instructs the model to respond in the selected language.

Adding a new locale requires:
1. Adding a key to the `Locale` type in `lib/dictionaries.ts`
2. Providing a full dictionary object for that locale
3. Updating the toggle in `components/locale-toggle.tsx`

---

## API Route

The `/api/generate` POST endpoint handles all generation requests. It accepts:

```ts
{
  productName: string   // Required. Max 200 characters.
  mode: "all" | "seo"  // "all" fills all fields; "seo" fills only SEO fields.
  locale: "en" | "ru"  // Controls the language of the generated content.
}
```

The endpoint validates the input, constructs a structured prompt with a strict JSON response schema, calls the generation model, and validates the response against `aiGeneratedSchema` before returning it.

---

## CRM API Payload

The form submits to the TableCRM API with the following structure:

```json
[
  {
    "name": "Product Name",
    "type": "product",
    "code": "SKU-001",
    "unit": 116,
    "category": 2477,
    "global_category_id": 127,
    "cashback_type": "lcard_cashback",
    "chatting_percent": 4,
    "marketplace_price": 500,
    "description_short": "Short description",
    "description_long": "Full product description",
    "seo_title": "SEO Title",
    "seo_description": "SEO meta description",
    "seo_keywords": ["keyword1", "keyword2"],
    "address": "City, Country",
    "latitude": 55.7712,
    "longitude": 49.1021
  }
]
```

Fields `unit`, `category`, `global_category_id`, `cashback_type`, `chatting_percent`, and `type` are fixed CRM defaults defined in `lib/constants.ts` and transmitted as hidden form fields.

---

## Field Limits

All limits are defined as constants in `lib/constants.ts` and enforced both in the Zod schema and in `maxLength` attributes on form inputs.

| Field | Limit |
|---|---|
| Product Name | 200 characters |
| Product Code | 100 characters |
| Short Description | 500 characters |
| Long Description | 5000 characters |
| SEO Title | 60 characters |
| SEO Description | 160 characters |
| SEO Keywords | 20 items |
| Address | 300 characters |
| Price | 0 — 10,000,000 |
| Latitude | -90 to 90 |
| Longitude | -180 to 180 |

---

## Testing

Unit tests for the Zod schemas are located in `__tests__/schema.test.ts`. They cover required field validation, character limits, coordinate ranges, price ranges, SKU normalization, keyword limits, and CRM default values.

```bash
npm test
```

---

## Deployment

The project is configured for deployment on [Vercel](https://vercel.com).

1. Push the repository to GitHub.
2. Import the repository in the Vercel dashboard.
3. Add the `GEMINI_API_KEY` environment variable under **Settings → Environment Variables**.
4. Deploy. Vercel automatically detects Next.js and applies the correct build settings.

The `/api/generate` route is deployed as a Vercel Serverless Function.

---

## License

MIT
