"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AcknowledgeButton({ redFlagId }: { redFlagId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await fetch(`/api/redflags/${redFlagId}/acknowledge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ actor_id: "console-user", actor_role: "clinician" }),
        });
        router.refresh();
      }}
      className="shrink-0 px-space-sm py-1 rounded-md bg-primary text-on-primary font-clinical-data text-clinical-data font-semibold disabled:opacity-50"
    >
      {pending ? "Acknowledging…" : "Acknowledge"}
    </button>
  );
}
