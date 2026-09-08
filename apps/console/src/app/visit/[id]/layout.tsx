import Link from "next/link";

const tabs = [
  { href: "", label: "Overview", icon: "person_search" },
  { href: "/dossier", label: "Dossier", icon: "fact_check" },
  { href: "/timeline", label: "Timeline", icon: "timeline" },
  { href: "/summary", label: "Summary", icon: "description" },
  { href: "/sign", label: "Sign", icon: "edit_document" },
];

export default async function VisitLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const base = `/visit/${id}`;

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-outline-variant mb-space-md print:hidden">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={`${base}${tab.href}`}
            className="flex items-center gap-1.5 px-space-md py-2 text-clinical-data font-clinical-data text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-t transition-colors"
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
