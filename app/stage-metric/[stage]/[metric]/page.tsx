import Link from 'next/link';
import { mockCheckoutSessions } from '@/app/data/mock-data';

const stageSlugs: Record<string, string> = {
  'cart-review': 'Cart Review',
  'payment-method-selection': 'Payment Method Selection',
  'payment-details-entry': 'Payment Details Entry',
  '3ds-challenge': '3DS Challenge',
  authorization: 'Authorization',
  confirmation: 'Confirmation',
};

const metricLabels: Record<string, string> = {
  'stage-volume': 'Stage Volume',
  'confirmation-rate': 'Confirmation Rate',
  'drop-off-rate': 'Drop-off Rate',
  'avg-amount': 'Avg. Amount',
};

const getFailureReason = (session: any) => {
  if (session.declineCode) return session.declineCode.replace(/_/g, ' ');
  if (session.stage === 'Authorization' && session.authOutcome === 'declined')
    return 'Authorization declined';
  return 'N/A';
};

export default function StageMetricDetailPage({
  params,
}: {
  params?: { stage: string; metric: string };
}) {
  const stageSlug = params?.stage ?? '';
  const metricSlug = params?.metric ?? '';
  const stageName = stageSlugs[stageSlug] ?? stageSlug.replace(/-/g, ' ');
  const metricLabel = metricLabels[metricSlug] ?? metricSlug.replace(/-/g, ' ');

  const stageSessions = mockCheckoutSessions.filter(
    (session) => session.stage === stageName,
  );
  const rows = stageSessions.map((session) => ({
    id: session.id,
    timestamp: session.timestamp,
    stage: session.stage,
    droppedOffAt:
      session.stage === 'Confirmation' ? 'Completed' : session.stage,
    failureReason: getFailureReason(session),
    paymentMethod: session.paymentMethod,
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link
          href={`/stages/${stageSlug}`}
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to {stageName}
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            {metricLabel}
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Session-level investigation
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Drill into individual sessions for {stageName} and inspect
            timestamps, payment method, failure reason, and drop-off behavior.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-800">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Timestamp</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Dropped off at</th>
                <th className="px-4 py-3 font-medium">Failure reason</th>
                <th className="px-4 py-3 font-medium">Payment method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-4 py-3">{row.id}</td>
                  <td className="px-4 py-3">{row.timestamp}</td>
                  <td className="px-4 py-3">{row.stage}</td>
                  <td className="px-4 py-3">{row.droppedOffAt}</td>
                  <td className="px-4 py-3">{row.failureReason}</td>
                  <td className="px-4 py-3 capitalize">
                    {row.paymentMethod.replace('_', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
