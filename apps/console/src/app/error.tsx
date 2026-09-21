"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Console application error:", error);
  }, [error]);

  return (
    <div className="p-panel-padding max-w-xl mx-auto my-12">
      <div className="rounded-xl border border-error-container bg-error-container/20 p-panel-padding">
        <h2 className="font-section-title text-section-title text-error mb-space-xs">
          Something went wrong
        </h2>
        <p className="text-clinical-data text-on-surface-variant mb-space-sm">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          onClick={() => reset()}
          className="px-space-md py-space-xs rounded-lg bg-error text-surface font-body-strong text-body-strong hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
