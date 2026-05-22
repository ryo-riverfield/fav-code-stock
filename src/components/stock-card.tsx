import Link from "next/link";
import { DeleteStockButton } from "@/components/delete-stock-button";
import { EditStockButton } from "@/components/edit-stock-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";
import type { StockWithRelations } from "@/types/stock";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function StockCard({
  stock,
  categories,
  languages,
}: {
  stock: StockWithRelations;
  categories: Category[];
  languages: Language[];
}) {
  return (
    <Card className="border-border/60 bg-card/60 transition-colors hover:border-border">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{stock.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            {stock.languages && (
              <Badge variant="secondary" className="font-mono text-xs">
                {stock.languages.name}
              </Badge>
            )}
            <EditStockButton
              stock={stock}
              categories={categories}
              languages={languages}
            />
            <DeleteStockButton stockId={stock.id} stockTitle={stock.title} />
          </div>
        </div>
        <CardDescription className="font-mono text-xs">
          {formatDate(stock.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {stock.url && (
          <Link
            href={stock.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sky-400 hover:underline break-all"
          >
            {stock.url}
          </Link>
        )}
        {stock.code && (
          <pre className="overflow-x-auto rounded-lg border border-border/80 bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground/90">
            <code>{stock.code}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
