"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SkillCard } from "@/components/skill-card";
import type { Skill } from "@/lib/vault";
import { cn } from "@/lib/utils";

interface Props {
  skills: Skill[];
}

export function SkillsSearch({ skills }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of skills) {
      map.set(s.category, (map.get(s.category) ?? 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [skills]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (category && s.category !== category) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }, [skills, query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of filtered) {
      const list = map.get(s.category) ?? [];
      list.push(s);
      map.set(s.category, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="skill-search" className="text-xs uppercase tracking-wide text-muted-foreground">
          Search skills
        </Label>
        <Input
          id="skill-search"
          placeholder="Filter by title, tag, or category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={cn(
            "rounded-md border px-2 py-1 text-xs font-medium",
            category === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:bg-accent"
          )}
        >
          all ({skills.length})
        </button>
        {categories.map(([c, n]) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory((cur) => (cur === c ? null : c))}
            aria-pressed={category === c}
            className={cn(
              "rounded-md border px-2 py-1 text-xs font-medium capitalize",
              category === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:bg-accent"
            )}
          >
            {c} <span className="tnum">({n})</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing <span className="tnum">{filtered.length}</span> of{" "}
        <span className="tnum">{skills.length}</span> skills.
      </p>
      <div className="flex flex-col gap-6">
        {grouped.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No skills match the current filter.
          </p>
        )}
        {grouped.map(([cat, items]) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <div className="mb-2 flex items-center gap-2">
              <h3
                id={`cat-${cat}`}
                className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {cat}
              </h3>
              <Badge variant="muted" className="tnum">
                {items.length}
              </Badge>
            </div>
            {items.length === 0 ? (
              <p className="text-xs italic text-muted-foreground">
                No skills in this category yet.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <SkillCard key={s.id} skill={s} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
