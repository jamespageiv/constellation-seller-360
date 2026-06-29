import AppShell from "@/components/AppShell";
import OpportunityDetail from "@/components/screens/OpportunityDetail";

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell>
      <OpportunityDetail opportunityId={id} />
    </AppShell>
  );
}
