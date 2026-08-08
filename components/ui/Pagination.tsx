"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  lastPage,
  total,
  from,
  to,
  disabled,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-2.5 sm:flex-row">
      <p className="text-xs text-ink-soft">
        Showing {from ?? 0}&ndash;{to ?? 0} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <span className="text-xs font-semibold text-ink">
          Page {page} of {lastPage}
        </span>
        <button
          type="button"
          disabled={disabled || page >= lastPage}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
