<div align="center">

# TableCRM — Enterprise Product Creation Form

<p align="center">
  <strong>Production-grade, bilingual product catalog management interface engineered with Next.js 14 App Router, TypeScript, shadcn/ui, and Google Gemini 2.5 Flash structured inference.</strong>
</p>

[![Next.js 14.2](https://img.shields.io/badge/Next.js-14.2-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 18.2](https://img.shields.io/badge/React-18.2-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 3.4](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_UI-000000?style=flat-square&logo=radix-ui&logoColor=white)](https://ui.shadcn.com/)
[![Google Gemini 2.5](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=flat-square&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Zod 3.23](https://img.shields.io/badge/Zod-3.23-3E67B1?style=flat-square&logo=zod&logoColor=white)](https://zod.dev/)
[![Jest 29](https://img.shields.io/badge/Jest-29.7-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

<br />

**[Features](#-features)** • **[Architecture](#-system-architecture)** • **[Engineering Highlights](#-key-architectural--engineering-highlights)** • **[Tech Stack](#-tech-stack)** • **[Project Structure](#-project-structure)** • **[API Contracts](#-api--integration-contracts)** • **[Testing & Verification](#-testing--static-analysis)** • **[Getting Started](#-getting-started--setup)**

<br />

<img width="100%" alt="TableCRM Product Creation Form Light Mode" src="https://github.com/user-attachments/assets/6620e656-a66b-4af8-832b-ea754a84ed94" />
<img width="100%" alt="TableCRM Product Creation Form Dark Mode" src="https://github.com/user-attachments/assets/e408d304-8d7e-4751-8a50-50825af1041e" />

</div>

---

## 🚀 Features

- **⚡ Dual-Mode AI Generation Engine** — Context-aware automated synthesis of SKU identifiers, realistic marketplace pricing, marketing copy (short/long), and SEO metadata via Google Gemini 2.5 Flash with strict JSON schema adherence.
- **🌐 Hydration-Safe Bilingual Architecture (EN / RU)** — Zero-flicker English and Russian localization with client-side `localStorage` persistence, runtime locale synchronization, and language-tailored AI completions.
- **🛡️ Bidirectional Schema Enforcement & Sanitization** — Full-pipeline data validation powered by Zod and `react-hook-form`. Features automatic whitespace trimming, uppercase SKU normalization, real-time character counters, and geographic coordinate bounding.
- **🎨 Modern Responsive Design System** — Built on shadcn/ui primitives with Radix UI accessibility standards, Tailwind CSS design tokens, smooth interactive transitions, and system-aware dark/light theme switching via `next-themes`.
- **🔒 Enterprise Security & Isolation** — Server-side API key encapsulation preventing client bundle leakage, comprehensive HTTP response headers (`nosniff`, `DENY`, `HSTS`), and upstream LLM error mapping.
- **💼 TableCRM Nomenclature Contract Compliance** — Direct integration with TableCRM REST endpoints using immutable system constants, category IDs, and cashback structures.

---

## 🏛 System Architecture

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT TIER (BROWSER)                                │
│                                                                                        │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                         Next.js 14 App Router UI                               │   │
│   │                                                                                │   │
│   │  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────────────┐  │   │
│   │  │     ThemeProvider     │  │    LocaleProvider     │  │   Shadcn/UI Form   │  │   │
│   │  │  (next-themes / Dark) │  │  (EN / RU LocalStore) │  │ (Radix Primitives) │  │   │
│   │  └───────────────────────┘  └───────────────────────┘  └────────────────────┘  │   │
│   │                                                                                │   │
│   │  ┌──────────────────────────────────────────────────────────────────────────┐  │   │
│   │  │                     React Hook Form + Zod Resolver                       │  │   │
│   │  │   - Real-time schema validation (productSchema)                          │  │   │
│   │  │   - Auto uppercase SKU, coordinate ranges, price bounds                  │  │   │
│   │  │   - Reactive character counters, error alerts & skeleton overlays        │  │   │
│   │  └───────────────────────┬──────────────────────────────────┬───────────────┘  │   │
│   └──────────────────────────┼──────────────────────────────────┼──────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┼──────────────────────┘
                               │                                  │
                  POST /api/generate (JSON)              POST Nomenclature Payload
                               │                                  │
┌──────────────────────────────▼──────────────────────────────────┼──────────────────────┐
│                                NEXT.JS SERVERLESS RUNTIME       │                      │
│                                                                 │                      │
│   ┌──────────────────────────────────────────────────────────┐  │                      │
│   │  /api/generate Route Handler (Node.js Environment)       │  │                      │
│   │                                                          │  │                      │
│   │  1. Inbound Request Sanitization & Boundary Verification │  │                      │
│   │  2. Dynamic System Prompt & Target Locale Injection      │  │                      │
│   │  3. Gemini 2.5 Flash Structured Schema Invocation        │  │                      │
│   │  4. Outbound AI Response Truncation & Schema Parsing     │  │                      │
│   │     (aiGeneratedSchema Validation via Zod)               │  │                      │
│   └──────────────────────────┬───────────────────────────────┘  │                      │
└──────────────────────────────┼──────────────────────────────────┼──────────────────────┘
                               │                                  │
                 Google GenAI SDK (Internal)                      │ HTTPS (REST)
                               │                                  │
┌──────────────────────────────▼───────────────────────┐  ┌───────▼──────────────────────┐
│             GOOGLE GEMINI AI PLATFORM                │  │       TABLECRM REST API      │
│                                                      │  │                              │
│   ┌──────────────────────────────────────────────┐   │  │  POST /api/v1/nomenclature/  │
│   │           Gemini 2.5 Flash Model             │   │  │                              │
│   │                                              │   │  │  - Normalized Product JSON   │
│   │  - Structured JSON Schema Constraint         │   │  │  - CRM Default Identifier IDs│
│   │  - Low Latency E-Commerce Content Generation │   │  │  - Geo Coordinates & Pricing │
│   │  - Multilingual Title, SEO & Description     │   │  │  - Invariant Taxonomy Code   │
│   └──────────────────────────────────────────────┘   │  │                              │
└──────────────────────────────────────────────────────┘  └──────────────────────────────┘
```

---

## ⚡ Key Architectural & Engineering Highlights

1. **Bidirectional Schema Enforcement & Defensive Sanitization (`lib/schema.ts`)**  
   The system employs dual Zod schemas (`productSchema` and `aiGeneratedSchema`) to establish airtight boundary contracts across client and server tiers. Inbound form data undergoes deterministic transformation pipeline: strings are trimmed, product codes are normalized to uppercase (`.transform((v) => v.trim().toUpperCase())`), and numeric values are coerced with strict domain bounds (latitudes $[-90, 90]$, longitudes $[-180, 180]$, prices $[0, 10\,000\,000]$). AI model outputs pass through defensive truncation transforms (`.slice(0, MAX)`) and array sanitizers to neutralize LLM hallucination risk or token overflow before state propagation.

2. **Zero-Leakage Server-Side LLM Proxy with Structured JSON Schema (`app/api/generate/route.ts`)**  
   All artificial intelligence operations are encapsulated within an isolated Next.js Route Handler powered by `@google/genai`. Upstream API credentials (`GEMINI_API_KEY`) remain strictly confidential on the server. The proxy leverages native Gemini `responseMimeType: "application/json"` with explicit `responseSchema` definitions for dual execution modes (`all` vs `seo`). The endpoint implements fine-grained HTTP status mapping: distinguishing bad client requests (`400`), upstream schema mismatches (`502`), quota exhaustion (`503`), and unconfigured environments (`503`).

3. **Hydration-Safe Client-Side Internationalization (`lib/locale-context.tsx`)**  
   To prevent SSR/CSR React hydration mismatches (Next.js Error #418/425) when reading client preferences from `localStorage`, the `LocaleProvider` implements a two-stage mount synchronization pattern. Dynamic dictionary lookups (`lib/dictionaries.ts`) fall back gracefully to the default English locale during initial server rendering, then seamlessly synchronize with browser storage and update `document.documentElement.lang` on mount. Active locale context is passed downstream to AI generation requests to ensure linguistic consistency across generated copy.

4. **Optimistic UI Feedback, Mutation Locking & Loading Skeletons (`components/product-form.tsx`)**  
   Form interactions utilize `react-hook-form` in `mode: "onChange"` for instant field-level validation and real-time character limit consumption metrics (`field.value.length / MAX`). Mutating operations (AI generation, form submission) trigger atomic state locks (`isGeneratingAutoFill`, `isGeneratingSEO`, `isSubmitting`), preventing race conditions from concurrent dispatches. During LLM generation, targeted inputs switch to animated `Skeleton` states, preserving layout stability while signaling background asynchronous computation.

---

## 🛠 Tech Stack

| Layer / Domain | Technologies / Version | Description / Purpose |
|---|---|---|
| **Core Framework** | Next.js `14.2.3` (App Router, SSR, Route Handlers) | React application framework and serverless backend runtime |
| **Language** | TypeScript `5.x` | Static typing, strict null checks, and interface contracts |
| **UI & Component System** | shadcn/ui • Radix UI Primitives | Accessible, composable UI building blocks (Dialog, Toast, Form) |
| **Styling & Design Tokens** | Tailwind CSS `3.4.1` • `tailwindcss-animate` | Utility-first responsive CSS framework with theme variables |
| **Form Management** | `react-hook-form` `7.51.5` • `@hookform/resolvers` | Performant, uncontrolled form state management and validation |
| **Schema & Validation** | Zod `3.23.8` | Declarative schema validation, parsing, and type inference |
| **AI / LLM Engine** | Google GenAI SDK (`@google/genai` `1.42.0`) • Gemini 2.5 Flash | High-speed structured JSON generation for e-commerce metadata |
| **Theme & Localization** | `next-themes` `0.4.6` • Custom React Context | Dark/Light mode switching and hydration-safe EN/RU i18n |
| **Icons & Visuals** | `lucide-react` `0.381.0` | Modern, tree-shakeable icon set |
| **Testing & Quality** | Jest `29.7.0` • `ts-jest` `29.4.6` • ESLint `8.x` | Unit testing framework, TypeScript preprocessor, and linter |

---

## 📁 Project Structure

```
ProductCreationForm/
├── .eslintrc.json              # ESLint configuration extending next/core-web-vitals
├── .gitignore                  # Git exclusion rules for node_modules and .env
├── .env.example                # Environment variable configuration template
├── components.json             # shadcn/ui CLI component generator metadata
├── jest.config.js              # Jest configuration with ts-jest module mapping
├── next.config.js              # Next.js configuration with global HTTP security headers
├── package.json                # Project dependencies, scripts, and runtime engines
├── postcss.config.js           # PostCSS plugin pipeline (Tailwind CSS, Autoprefixer)
├── tailwind.config.ts          # Tailwind styling tokens, colors, and keyframe animations
├── tsconfig.json               # TypeScript strict compiler configuration and path aliases
├── __tests__/
│   └── schema.test.ts          # Unit test suites verifying Zod validation schemas
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # Server-side Gemini AI generation proxy endpoint
│   ├── globals.css             # CSS variables, Tailwind directives, and root theme layers
│   ├── layout.tsx              # Root HTML layout wrapping ThemeProvider & Toaster
│   └── page.tsx                # Primary page view orchestrating LocaleProvider & ProductForm
├── components/
│   ├── locale-toggle.tsx       # Interactive EN / RU language switcher button
│   ├── product-form.tsx        # Main product creation form component with AI assistants
│   ├── theme-provider.tsx      # next-themes context provider wrapper
│   ├── theme-toggle.tsx        # Dark / Light theme toggle with icon animations
│   └── ui/                     # Reusable shadcn/ui design system components
│       ├── button.tsx          # Button variants (default, secondary, destructive, outline)
│       ├── card.tsx            # Card containers, headers, content, and footers
│       ├── form.tsx            # React Hook Form integration wrappers and form items
│       ├── input.tsx           # Standardized text and numeric input elements
│       ├── label.tsx           # Radix UI label primitive wrapper
│       ├── skeleton.tsx        # Pulsing skeleton placeholder for loading states
│       ├── textarea.tsx        # Multi-line text inputs with custom sizing
│       ├── toast.tsx           # Radix UI Toast notification component
│       ├── toaster.tsx         # Global toast rendering container
│       └── use-toast.ts        # Toast event dispatcher and state management hook
└── lib/
    ├── constants.ts            # TableCRM default identifiers and field length limits
    ├── dictionaries.ts         # Complete English and Russian localization dictionaries
    ├── locale-context.tsx      # React Context, custom useLocale hook, and storage logic
    ├── schema.ts               # Zod validation schemas for product form and AI response
    └── utils.ts                # clsx and tailwind-merge helper function (cn)
```

---

## 🔌 API & Integration Contracts

### 1. Serverless AI Generation (`POST /api/generate`)

Generates structured marketplace copy and SEO attributes from a given product title.

**Request Payload:**
```json
{
  "productName": "Wireless Noise-Canceling Headphones",
  "mode": "all",
  "locale": "en"
}
```

| Parameter | Type | Required | Description |
|---|---|:---:|---|
| `productName` | `string` | **Yes** | Base product title (1–200 characters). |
| `mode` | `"all" \| "seo"` | No | `"all"` generates full product fields; `"seo"` generates only SEO fields. Defaults to `"seo"`. |
| `locale` | `"en" \| "ru"` | No | Target output language. Defaults to `"en"`. |

**Successful Response (`200 OK`):**
```json
{
  "code": "WNC-HP-001",
  "marketplace_price": 299.99,
  "description_short": "Premium wireless headphones with active noise cancellation and 30-hour battery life.",
  "description_long": "Immerse yourself in crystal-clear audio with custom-tuned dynamic drivers...",
  "seo_title": "Wireless Noise-Canceling Headphones | Best Audio Deals",
  "seo_description": "Shop high-fidelity noise-canceling headphones with long-lasting battery.",
  "seo_keywords": ["headphones", "wireless", "noise canceling", "audio", "bluetooth"]
}
```

---

### 2. TableCRM Nomenclature Submission (`POST /api/v1/nomenclature/`)

The client form serializes and transmits product records directly to TableCRM using the following payload specification:

```json
[
  {
    "name": "Wireless Noise-Canceling Headphones",
    "type": "product",
    "code": "WNC-HP-001",
    "unit": 116,
    "category": 2477,
    "global_category_id": 127,
    "cashback_type": "lcard_cashback",
    "chatting_percent": 4,
    "marketplace_price": 299.99,
    "description_short": "Premium wireless headphones with active noise cancellation...",
    "description_long": "Immerse yourself in crystal-clear audio with custom-tuned drivers...",
    "seo_title": "Wireless Noise-Canceling Headphones | Best Audio Deals",
    "seo_description": "Shop high-fidelity noise-canceling headphones with long-lasting battery.",
    "seo_keywords": ["headphones", "wireless", "noise canceling", "audio"],
    "address": "San Francisco, CA, USA",
    "latitude": 37.7749,
    "longitude": -122.4194
  }
]
```

---

### 3. Field Constraint Matrix

All field limits are enforced synchronously by `lib/constants.ts`, validated in `lib/schema.ts`, and constrained via HTML input attributes:

| Field Key | Data Type | Constraint / Boundary | Enforced In |
|---|---|---|---|
| `name` | `string` | $1 \le \text{length} \le 200$ chars | Zod • Input `maxLength` |
| `code` | `string` | $1 \le \text{length} \le 100$ chars, Uppercase | Zod • Input `maxLength` |
| `marketplace_price` | `number` | $0.00 \le \text{value} \le 10\,000\,000.00$ | Zod • Input `min/max` |
| `description_short` | `string` | $\le 500$ chars | Zod • Textarea `maxLength` |
| `description_long` | `string` | $\le 5000$ chars | Zod • Textarea `maxLength` |
| `seo_title` | `string` | $\le 60$ chars | Zod • Input `maxLength` |
| `seo_description` | `string` | $\le 160$ chars | Zod • Textarea `maxLength` |
| `seo_keywords` | `string[]` | $\le 20$ items (each $1 \le \text{length} \le 50$) | Zod • Tokenizer Split |
| `address` | `string` | $\le 300$ chars | Zod • Input `maxLength` |
| `latitude` | `number` | $-90.00 \le \text{value} \le 90.00$ | Zod • Coordinate Range |
| `longitude` | `number` | $-180.00 \le \text{value} \le 180.00$ | Zod • Coordinate Range |

---

## 🧪 Testing & Static Analysis

The repository maintains an automated validation pipeline covering unit test suites, TypeScript type compilation, and code linting.

```bash
# Execute Jest unit test suites
npm test

# Run tests in CI mode with code coverage analysis
npm run test:ci

# Perform strict TypeScript type checking without emitting files
npx tsc --noEmit

# Run ESLint validation checks
npm run lint

# Compile production build
npm run build
```

### Test Suite Verification (`__tests__/schema.test.ts`)

| Test Suite | Assertions & Scenarios Covered | Status |
|---|---|:---:|
| `productSchema` | Minimal valid payload acceptance, empty field rejections | `PASS` |
| `productSchema` | SKU auto-trimming and uppercase transform (`WIDGET-001`) | `PASS` |
| `productSchema` | Geographic coordinate boundaries (Lat $[-90, 90]$, Lng $[-180, 180]$) | `PASS` |
| `productSchema` | Price coercion, negative price rejection, and realistic upper ceiling | `PASS` |
| `productSchema` | Strict SEO string lengths (Title $\le 60$, Desc $\le 160$) and keyword caps ($\le 20$) | `PASS` |
| `productSchema` | Invariant TableCRM default metadata injection (`category`, `unit`, `cashback`) | `PASS` |
| `aiGeneratedSchema` | Full AI payload parsing, optional partial payload tolerance | `PASS` |
| `aiGeneratedSchema` | Defensive truncation of overflowing AI text fields and empty code rejection | `PASS` |

---

## ⚙️ Getting Started & Setup

### Prerequisites

- **Node.js**: `v18.17.0` or higher (`node -v`)
- **Package Manager**: `npm` (v9+) or `pnpm` / `yarn`
- **Google Gemini API Key**: Obtainable via [Google AI Studio](https://aistudio.google.com/apikey)

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/adiletbtrv/ProductCreationForm.git
cd ProductCreationForm

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
```

Edit `.env.local` to provide your Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

```bash
# 4. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Hardening

Production deployments include strict security headers pre-configured in `next.config.js`:

```javascript
// HTTP Response Security Headers applied globally
"X-Content-Type-Options": "nosniff",
"X-Frame-Options": "DENY",
"X-XSS-Protection": "1; mode=block",
"Referrer-Policy": "strict-origin-when-cross-origin",
"Permissions-Policy": "camera=(), microphone=(), geolocation=(self)",
"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
```

- **Credential Encapsulation**: Upstream LLM tokens are kept exclusively in server memory (`process.env.GEMINI_API_KEY`) and are never bundled into client-side JavaScript.
- **Input Sanitization**: Inbound API requests are capped at 200 characters and validated against boundary constraints before contacting upstream providers.

---

## 📜 License & Author

Distributed under the **MIT License**. See `LICENSE` for more information.

**Author:** [Adilet Batyrov](https://github.com/adiletbtrv) • Connect on [LinkedIn](https://www.linkedin.com/in/adilet-batyrov/)
