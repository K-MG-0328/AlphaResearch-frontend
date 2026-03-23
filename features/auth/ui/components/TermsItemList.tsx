import Link from "next/link";
import { TERM_ITEMS } from "@/features/auth/domain/model/termItem";

interface TermsItemListProps {
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export default function TermsItemList({ checked, onToggle }: TermsItemListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {TERM_ITEMS.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-700"
        >
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={checked[item.id] ?? false}
              onChange={() => onToggle(item.id)}
              className="h-4 w-4 cursor-pointer accent-zinc-900 dark:accent-zinc-50"
            />
            <span
              className={
                item.required
                  ? "rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "rounded-full border border-zinc-300 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-600 dark:text-zinc-400"
              }
            >
              {item.required ? "필수" : "선택"}
            </span>
            <span className="text-sm text-zinc-900 dark:text-zinc-50">{item.title}</span>
          </label>
          <Link
            href={item.link}
            className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            보기
          </Link>
        </li>
      ))}
    </ul>
  );
}
