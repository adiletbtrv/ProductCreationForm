import { ProductForm } from '@/components/product-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-end mb-4">
                    <ThemeToggle />
                </div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Create New Product</h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Fill in the information below to add a new product to the CRM.
                    </p>
                </div>
                <ProductForm />
            </div>
        </main>
    )
}
