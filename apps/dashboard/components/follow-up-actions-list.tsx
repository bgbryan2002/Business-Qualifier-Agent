"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  actions: string[];
}

export function FollowUpActionsList({ actions }: Props) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  if (!actions || actions.length === 0) {
    return (
      <section aria-labelledby="follow-up-heading">
        <h3 id="follow-up-heading" className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Follow-up actions
        </h3>
        <p className="text-sm text-muted-foreground">
          No follow-up actions recorded.
        </p>
      </section>
    );
  }
  return (
    <section aria-labelledby="follow-up-heading">
      <h3
        id="follow-up-heading"
        className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
      >
        Follow-up actions ({actions.length})
      </h3>
      <p className="mb-3 text-xs italic text-muted-foreground">
        Planned actions, not tracked — checkboxes here are advisory and do not persist.
      </p>
      <ul className="flex flex-col gap-2">
        {actions.map((a, i) => {
          const id = `follow-up-${i}`;
          return (
            <li key={i} className="flex items-start gap-2">
              <Checkbox
                id={id}
                checked={!!checked[i]}
                onCheckedChange={(v) =>
                  setChecked((s) => ({ ...s, [i]: v === true }))
                }
                aria-describedby={`${id}-note`}
              />
              <Label htmlFor={id} className="text-sm leading-snug font-normal">
                {a}
              </Label>
              <span id={`${id}-note`} className="sr-only">
                planned action, not tracked
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
