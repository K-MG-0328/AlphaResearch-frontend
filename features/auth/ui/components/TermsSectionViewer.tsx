import { TERM_ITEMS } from "@/features/auth/domain/model/termItem";

interface TermsSectionViewerProps {
  termId: string;
}

export default function TermsSectionViewer({ termId }: TermsSectionViewerProps) {
  const item = TERM_ITEMS.find((t) => t.id === termId);

  if (!item) return null;

  return (
    <div className="flex min-h-screen justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="w-full max-w-xl">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{item.title}</h1>
        <div className="flex flex-col gap-6">
          {item.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-1">
                {section.content.map((line, i) => (
                  <li key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
