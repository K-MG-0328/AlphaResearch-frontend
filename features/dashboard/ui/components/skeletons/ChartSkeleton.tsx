export default function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-36 rounded-md bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex gap-2">
          {["1D", "1W", "1M", "1Y"].map((t) => (
            <div key={t} className="h-7 w-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          ))}
        </div>
      </div>
      <div className="h-80 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}
