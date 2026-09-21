import { redirect } from "next/navigation";

export default async function AyurvedaIndexPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/visit/${id}/ayurveda/prashna`);
}
