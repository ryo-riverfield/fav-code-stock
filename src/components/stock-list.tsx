import { fetchStocks } from "@/app/actions/stocks";
import { fetchCategories, fetchLanguages } from "@/app/actions/masters";
import {
  StockListAccordion,
  type CategoryGroup,
} from "@/components/stock-list-accordion";
import { Card, CardContent } from "@/components/ui/card";
import type { StockWithRelations } from "@/types/stock";

function groupStocksByCategory(stocks: StockWithRelations[]): CategoryGroup[] {
  const map = new Map<number, CategoryGroup>();

  for (const stock of stocks) {
    const categoryId = stock.category_id;
    const categoryName = stock.categories?.name ?? "不明";

    if (!map.has(categoryId)) {
      map.set(categoryId, { categoryId, categoryName, stocks: [] });
    }
    map.get(categoryId)!.stocks.push(stock);
  }

  return Array.from(map.values())
    .filter((g) => g.stocks.length > 0)
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName, "ja"));
}

export async function StockList() {
  const [stocks, categories, languages] = await Promise.all([
    fetchStocks(),
    fetchCategories(),
    fetchLanguages(),
  ]);

  if (stocks.length === 0) {
    return (
      <Card className="border-dashed border-border/80 bg-muted/20">
        <CardContent className="py-12 text-center text-muted-foreground">
          まだストックがありません。左のフォームから追加してください。
        </CardContent>
      </Card>
    );
  }

  const groups = groupStocksByCategory(stocks);

  return (
    <StockListAccordion
      groups={groups}
      categories={categories}
      languages={languages}
    />
  );
}
