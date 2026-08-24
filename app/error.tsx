"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { ButtonPrimary } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <h1 className="mb-2 font-display text-2xl font-bold text-ink">
          Something went wrong
        </h1>

        <p className="mb-6 text-sm text-ink-soft">
          An unexpected error occurred. Please try again or contact support if the problem persists.
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
            onClick={() => window.location.href = "/"}
            className="text-sm font-semibold text-orange-deep hover:underline"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}
