import { listSkills } from "@/lib/vault";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { SkillsSearch } from "@/components/skills-search";

export const metadata = { title: "Skills — BQA Dashboard" };

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const skills = listSkills();

  if (skills.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        </header>
        <EmptyState
          title="No validated skills yet"
          body="Run the repo-discovery + repo-validator subagents to populate the skill catalog."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {skills.length} validated skills across{" "}
          {new Set(skills.map((s) => s.category)).size} categories.
        </p>
      </header>
      <Card>
        <CardContent className="p-4">
          <SkillsSearch skills={skills} />
        </CardContent>
      </Card>
    </div>
  );
}
