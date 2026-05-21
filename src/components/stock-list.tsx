import Link from "next/link";
import { fetchStocks } from "@/app/actions/stocks";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Stock } from "@/types/stock";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export async function StockList() {
  const stocks = (await fetchStocks()) as Stock[];

  if (stocks.length === 0) {
    return (
      <Card className="border-dashed border-border/80 bg-muted/20">
        <CardContent className="py-12 text-center text-muted-foreground">
          まだストックがありません。左のフォームから追加してください。
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {stocks.map((stock) => (
        <li key={stock.id}>
          <Card className="border-border/60 bg-card/60 transition-colors hover:border-border">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold">
                  {stock.title}
                </CardTitle>
                {stock.code_lang && (
                  <Badge variant="secondary" className="font-mono text-xs">
                    {stock.code_lang}
                  </Badge>
                )}
              </div>
              <CardDescription className="font-mono text-xs">
                {formatDate(stock.created_at)}
                {stock.created_user && ` · ${stock.created_user}`}
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
        </li>
      ))}
    </ul>
  );
}
