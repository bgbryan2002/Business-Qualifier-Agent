import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  asOf?: string;
  children: ReactNode;
}

/**
 * Standard editorial page wrapper. One h1 per surface (the `title`).
 */
export function PageShell({ eyebrow, title, lede, asOf, children }: Props) {
  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-12 sm:pt-16">
      <header className="mb-12 border-b border-rule pb-10">
        <div className="t-caption mb-4 text-gilt">{eyebrow}</div>
        <h1 className="t-h1 text-balance text-fg">{title}</h1>
        {lede ? <p className="t-lead text-pretty mt-5 prose-col text-fg-muted">{lede}</p> : null}
        {asOf ? (
          <div className="mt-6 text-[0.78rem] uppercase tracking-[0.14em] text-fg-quiet">
            As of <span className="tnum text-fg">{asOf}</span>
          </div>
        ) : null}
      </header>
      {children}
    </div>
  );
}
