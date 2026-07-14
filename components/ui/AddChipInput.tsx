"use client";

import { useState } from "react";

interface AddChipInputProps {
  onAdd: (value: string) => void;
  placeholder?: string;
}

export default function AddChipInput({ onAdd, placeholder = "Add custom..." }: AddChipInputProps) {
  const [value, setValue] = useState("");

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  }

  return (
    <div className="mt-2.25 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder={placeholder}
        className="flex-1 rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-2.25 text-[13.5px] text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-orange focus:bg-white"
      />
      <button
        type="button"
        onClick={handleAdd}
        disabled={!value.trim()}
        className="rounded-[10px] bg-orange px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-deep disabled:opacity-50"
      >
        + Add
      </button>
    </div>
  );
}
