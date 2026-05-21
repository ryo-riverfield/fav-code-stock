import { getAppSubtitle, getAppTitle, isProduction } from "@/lib/env";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AppBranding({
  className,
  titleClassName,
}: {
  className?: string;
  titleClassName?: string;
}) {
  const isDev = !isProduction();

  return (
    <div className={className}>
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {getAppSubtitle()}
      </p>
      <div className="mt-0 flex flex-wrap items-center gap-2">
        <h1
          className={cn(
            "text-xl font-semibold tracking-tight sm:text-2xl",
            titleClassName
          )}
        >
          {getAppTitle()}
        </h1>
        {isDev && (
          <Badge
            variant="outline"
            className="border-amber-500/60 font-mono text-xs text-amber-500"
          >
            DEV
          </Badge>
        )}
      </div>
    </div>
  );
}
