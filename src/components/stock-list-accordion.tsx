"use client";

import { StockCard } from "@/components/stock-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";
import type { StockWithRelations } from "@/types/stock";

export type CategoryGroup = {
  categoryId: number;
  categoryName: string;
  stocks: StockWithRelations[];
};

export function StockListAccordion({
  groups,
  categories,
  languages,
}: {
  groups: CategoryGroup[];
  categories: Category[];
  languages: Language[];
}) {
  const defaultOpen = groups.map((g) => String(g.categoryId));

  return (
    <Accordion defaultValue={defaultOpen} multiple className="space-y-2">
      {groups.map((group) => (
        <AccordionItem
          key={group.categoryId}
          value={String(group.categoryId)}
          className="rounded-xl border border-border/60 bg-card/40 px-4"
        >
          <AccordionTrigger className="py-3 hover:no-underline">
            <span className="flex items-center gap-2 font-medium">
              {group.categoryName}
              <Badge variant="secondary" className="font-mono text-xs">
                {group.stocks.length}
              </Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <ul className="space-y-3">
              {group.stocks.map((stock) => (
                <li key={stock.id}>
                  <StockCard
                    stock={stock}
                    categories={categories}
                    languages={languages}
                  />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
