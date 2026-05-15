import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfidenceMeter } from "@/components/confidence-meter";
import { ExternalLink } from "lucide-react";
import type { Skill } from "@/lib/vault";

const LICENSE_NAMES: Record<string, string> = {
  MIT: "MIT License",
  Apache: "Apache License 2.0",
  "Apache-2.0": "Apache License 2.0",
  ISC: "ISC License",
  BSD: "BSD License",
  "BSD-3-Clause": "BSD 3-Clause License",
  GPL: "GNU GPL",
  "GPL-3.0": "GNU GPL v3",
  "AGPL-3.0": "GNU AGPL v3",
  CC0: "Creative Commons Zero",
  unverified: "License unverified",
  "n/a-public-record": "Public record (no license)",
};

function licenseLabel(license: string): string {
  return LICENSE_NAMES[license] ?? `${license} License`;
}

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card className="transition-colors hover:border-primary/40">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-tight">
            {skill.title}
          </h3>
          <Badge variant="muted" className="capitalize">
            {skill.category}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={
              skill.license === "unverified" ? "warn" : "outline"
            }
            aria-label={licenseLabel(skill.license)}
            title={licenseLabel(skill.license)}
          >
            {skill.license}
          </Badge>
          <ConfidenceMeter value={skill.confidence} size="sm" />
        </div>
        {skill.source_url && (
          <a
            href={skill.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:no-underline"
            aria-label={`${skill.title} source (opens in new tab)`}
          >
            <span className="truncate max-w-[18rem]">{skill.source_url}</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
          </a>
        )}
        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skill.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="muted" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
