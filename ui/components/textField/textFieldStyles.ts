export const textFieldStyles = {
  wrapper: "flex flex-col gap-1.5",
  label: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
  input: {
    base: "h-11 w-full rounded-xl border px-4 text-sm text-zinc-900 outline-none transition-colors dark:bg-zinc-800 dark:text-zinc-50",
    default:
      "border-zinc-200 bg-white placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:placeholder:text-zinc-500 dark:focus:border-zinc-50",
    error:
      "border-red-400 bg-white placeholder:text-zinc-400 focus:border-red-500 dark:border-red-500 dark:placeholder:text-zinc-500 dark:focus:border-red-400",
  },
  errorMessage: "text-xs text-red-500 dark:text-red-400",
} as const;
