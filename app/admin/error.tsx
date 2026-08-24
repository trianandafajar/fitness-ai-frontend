"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/Button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-8 w-8 text-danger" />
          </div>
        </div>

        <h1 className="mb-2 font-display text-xl font-bold text-ink">
          Admin Panel Error
        </h1>

        <p className="mb-6 text-sm text-ink-soft">
          Something went wrong in the admin panel. Try refreshing or return to the admin home.
        </p>

        {error.digest && (
          <p className="mb-6 font-mono text-xs text-ink-faint">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <ButtonPrimary onClick={reset} className="w-full py-3">
            Try again
          </ButtonPrimary>

          <button
            onClick={() => window.location.href = "/admin"}
            className="text-sm font-semibold text-orange-deep hover:underline"
          >
            Go to admin home
          </button>
        </div>
      </div>
    </div>
  );
}
