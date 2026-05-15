import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatUsd } from "@/lib/utils";
import type { BuyerProfile } from "@/lib/vault";

export interface BuyerCardProps {
  buyer: BuyerProfile;
  dealCount: number;
  memoCount: number;
}

export function BuyerCard({ buyer, dealCount, memoCount }: BuyerCardProps) {
  const titleId = `buyer-${buyer.id}-title`;
  return (
    <article aria-labelledby={titleId}>
      <Card className="transition-colors hover:border-primary/40">
        <CardContent className="flex flex-col gap-3 p-5">
          <Link
            href={`/buyers/${buyer.id}`}
            className="flex flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 id={titleId} className="text-base font-semibold">
                {buyer.id}
              </h3>
              <Badge variant="outline" className="tnum">
                {buyer.geography.home_metro}
              </Badge>
              <Badge
                variant={
                  buyer.capital.sba_eligibility === "likely"
                    ? "positive"
                    : "muted"
                }
              >
                SBA: {buyer.capital.sba_eligibility}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground tnum">
              {formatUsd(buyer.capital.liquid_usd)} liquid ·{" "}
              {formatUsd(buyer.capital.borrowing_capacity_usd)} borrow ·
              target CF {formatUsd(buyer.capital.target_owner_profit_usd)}
            </p>
            <p className="text-xs text-muted-foreground tnum">
              {dealCount} listing{dealCount === 1 ? "" : "s"} reviewed ·{" "}
              {memoCount} memo{memoCount === 1 ? "" : "s"} · involvement:{" "}
              {buyer.operator_profile.involvement_level}
            </p>
          </Link>
        </CardContent>
      </Card>
    </article>
  );
}
