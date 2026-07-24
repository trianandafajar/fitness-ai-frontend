"use client";

import { FlaskConical } from "lucide-react";
import { toast } from "@/components/ui/Toast";

export default function ToastTestButton() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <button
      type="button"
      onClick={() =>
        toast.success("Test toast", {
          description: "This toast is ready for animation testing.",
        })
      }
      className="fixed bottom-4 right-4 z-90 flex items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-ink/90"
    >
      <FlaskConical size={14} />
      Test Toast
    </button>
  );
}
