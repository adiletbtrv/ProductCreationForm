<p align="center">
  <img src="public/logo.png" alt="TableCRM Product Form Logo" width="80" />
</p>

<h1 align="center">TableCRM — Product Creation Form</h1>

<p align="center">
  A production-ready product listing form for a marketplace CRM, built with Next.js, TypeScript, and shadcn/ui.
  <br />
  <a href="https://product-creation-form.vercel.app"><strong>Live Demo »</strong></a>
</p>

---

## Features

- **Smart Auto-Fill** — Enter a product name and let the assistant automatically generate SKU, price, short & long descriptions, and SEO fields powered by Google Gemini AI
- **SEO Generation** — Dedicated one-click SEO title, description, and keyword generation
- **Real-time Validation** — Instant field-level feedback as you type (react-hook-form + Zod)
- **Dark / Light Mode** — Full theme toggle powered by `next-themes`
- **Copy SKU** — One-click copy of the product article to clipboard
- **CRM Integration** — Submits directly to the TableCRM API with the correct payload shape
- **Secure API Key Handling** — Gemini API key is stored server-side and never exposed to the browser

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Forms | react-hook-form + Zod |
| AI Generation | Google Gemini 2.5 Flash (`@google/genai`) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Google Gemini API key — get one at [aistudio.google.com](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/adiletbtrv/ProductCreationForm.git
cd ProductCreationForm

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the root (see `.env.example`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## API Payload

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
    "seo_description": "SEO Description",
    "seo_keywords": ["keyword1", "keyword2"],
    "address": "City, Country",
    "latitude": 55.7712,
    "longitude": 49.1021
  }
]
```

---

## Deployment

The project is optimized for one-click deployment on [Vercel](https://vercel.com).

1. Push to GitHub
2. Import the repository in Vercel
3. Add the `GEMINI_API_KEY` environment variable in **Settings → Environment Variables**
4. Deploy

---

## License

MIT
