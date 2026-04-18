export default function IndicatorSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 h-4 w-20 rounded-md bg-zinc-200 dark:bg-zinc-700" />
      <div className="mb-2 h-3 w-12 rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-36 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}
