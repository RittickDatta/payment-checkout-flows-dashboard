import StageDashboard from '@/app/components/StageDashboard/StageDashboard';

export default async function StageDetailPage({
  params,
}: {
  params: Promise<{ stage: string }>;
}) {
  const { stage } = await params;

  return <StageDashboard stage={stage} />;
}
