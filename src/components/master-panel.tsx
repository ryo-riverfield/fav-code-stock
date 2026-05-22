"use client";

import { CategoryManager } from "@/components/category-manager";
import { LanguageManager } from "@/components/language-manager";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";

export function MasterPanel({
  categories,
  languages,
}: {
  categories: Category[];
  languages: Language[];
}) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-base tracking-tight">
          マスタ管理
        </CardTitle>
        <CardDescription>カテゴリー・言語の追加・編集・削除</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion defaultValue={["categories"]} multiple>
          <AccordionItem value="categories" className="border-border/60">
            <AccordionTrigger className="py-2 text-sm">カテゴリー</AccordionTrigger>
            <AccordionContent className="pb-4">
              <CategoryManager categories={categories} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="languages" className="border-border/60">
            <AccordionTrigger className="py-2 text-sm">言語</AccordionTrigger>
            <AccordionContent className="pb-4">
              <LanguageManager languages={languages} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
