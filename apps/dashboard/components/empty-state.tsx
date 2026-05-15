import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Inbox, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  body: string;
  cta?: { label: string; href: string };
  tone?: "neutral" | "positive" | "warn";
  className?: string;
}

const toneClass = {
  neutral: "border-border bg-muted/30",
  positive: "border-positive/30 bg-positive/5",
  warn: "border-warn/30 bg-warn/5",
};

const toneIcon = {
  neutral: Inbox,
  positive: CheckCircle2,
  warn: AlertTriangle,
};

export function EmptyState({
  title,
  body,
  cta,
  tone = "neutral",
  className,
}: EmptyStateProps) {
  const Icon = toneIcon[tone];
  const headingId = `empty-${title.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <section aria-labelledby={headingId}>
      <Card className={cn("border-dashed", toneClass[tone], className)}>
        <CardContent className="flex flex-col items-start gap-3 p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-5 w-5" aria-hidden />
            <h3 id={headingId} className="text-base font-semibold text-foreground">
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-prose">{body}</p>
          {cta && (
            <Button asChild variant="outline" size="sm">
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
