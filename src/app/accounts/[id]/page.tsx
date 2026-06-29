import AppShell from "@/components/AppShell";
import Account360 from "@/components/screens/Account360";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppShell>
      <Account360 accountId={id} />
    </AppShell>
  );
}
