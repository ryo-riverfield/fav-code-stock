import { fetchCategories, fetchLanguages } from "@/app/actions/masters";
import { AppBranding } from "@/components/app-branding";
import { UserMenu } from "@/components/auth/user-menu";
import { MasterPanel } from "@/components/master-panel";
import { StockForm } from "@/components/stock-form";
import { StockList } from "@/components/stock-list";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const [categories, languages] = await Promise.all([
    fetchCategories(),
    fetchLanguages(),
  ]);

  const defaultCategoryId =
    categories.find((c) => c.name === "未分類")?.id ?? categories[0]?.id;

  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-border/80 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <AppBranding />
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-10 sm:px-6">
        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <StockForm
            categories={categories}
            languages={languages}
            defaultCategoryId={defaultCategoryId}
          />
          <MasterPanel categories={categories} languages={languages} />
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-sm font-medium text-muted-foreground">
              STOCKS
            </h2>
          </div>
          <Separator className="mb-6" />
          <StockList />
        </section>
      </main>
    </div>
  );
}
