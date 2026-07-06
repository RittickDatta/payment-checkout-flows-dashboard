import Link from 'next/link';
import { mockCheckoutSessions } from '@/app/data/mock-data';

type StageDashboardProps = {
  stage: string;
};

const slugToStageName: Record<string, string> = {
  'cart-review': 'Cart Review',
  'payment-method-selection': 'Payment Method Selection',
  'payment-details-entry': 'Payment Details Entry',
  '3ds-challenge': '3DS Challenge',
  authorization: 'Authorization',
  confirmation: 'Confirmation',
};

export default function StageDashboard({ stage }: StageDashboardProps) {
  const stageName = slugToStageName[stage] ?? stage.replace(/-/g, ' ');
  const stageSessions = mockCheckoutSessions.filter(
    (session) => session.stage === stageName,
  );
  const totalSessions = mockCheckoutSessions.length;
  const confirmationCount = mockCheckoutSessions.filter(
    (session) => session.stage === 'Confirmation',
  ).length;
  const completionRate = stageSessions.length
    ? (confirmationCount / stageSessions.length) * 100
    : 0;
  const dropOffRate = Math.max(0, 100 - completionRate);
  const avgAmount = stageSessions.length
    ? stageSessions.reduce((sum, session) => sum + session.amount, 0) /
      stageSessions.length
    : 0;
  const stageShare = totalSessions
    ? (stageSessions.length / totalSessions) * 100
    : 0;

  const metrics = [
    {
      label: 'Stage Volume',
      value: `${stageSessions.length}`,
      detail: `${stageShare.toFixed(1)}% of all sessions`,
    },
    {
      label: 'Confirmation Rate',
      value: `${completionRate.toFixed(1)}%`,
      detail: `${confirmationCount} confirmed from this stage`,
    },
    {
      label: 'Drop-off Rate',
      value: `${dropOffRate.toFixed(1)}%`,
      detail: 'sessions not reaching confirmation',
    },
    {
      label: 'Avg. Amount',
      value: `$${avgAmount.toFixed(2)}`,
      detail: 'average order value for this stage',
    },
  ];

  const comparePeriods = (period: 'early' | 'late') => {
    const cutoff = new Date('2026-06-22T00:00:00.000Z');
    const sessions = mockCheckoutSessions.filter((session) => {
      const timestamp = new Date(session.timestamp);
      return period === 'early' ? timestamp < cutoff : timestamp >= cutoff;
    });

    const stageMatches = sessions.filter(
      (session) => session.stage === stageName,
    );
    const confirmations = sessions.filter(
      (session) => session.stage === 'Confirmation',
    );
    const stageVolume = stageMatches.length;
    const stageShareForPeriod = sessions.length
      ? (stageVolume / sessions.length) * 100
      : 0;
    const successRate = stageVolume
      ? (confirmations.length / stageMatches.length) * 100
      : 0;

    return {
      volume: stageVolume,
      share: stageShareForPeriod,
      successRate,
    };
  };

  const early = comparePeriods('early');
  const late = comparePeriods('late');
  const volumeDelta = late.volume - early.volume;
  const shareDelta = late.share - early.share;
  const rateDelta = late.successRate - early.successRate;
  const direction =
    rateDelta > 0 ? 'improved' : rateDelta < 0 ? 'worsened' : 'stayed flat';
  const volumeDirection =
    volumeDelta > 0
      ? 'increased'
      : volumeDelta < 0
        ? 'decreased'
        : 'stayed flat';

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to funnel
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Stage Analysis
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{stageName}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            This dashboard uses the mock checkout dataset to show the real
            volume, conversion, and value for this funnel stage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-slate-600">{metric.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Funnel Visualization</h2>
            <p className="mt-3 text-sm text-slate-600">
              Review the funnel from cart through confirmation using the mock
              checkout data.
            </p>
            <div className="mt-4 space-y-3">
              {[
                {
                  label: 'Cart',
                  reachedCount: mockCheckoutSessions.length,
                  percentOfOriginal: 100,
                  dropOffRate: 0,
                },
                {
                  label: 'Method Selection',
                  reachedCount: mockCheckoutSessions.filter((session) =>
                    [
                      'Payment Method Selection',
                      'Payment Details Entry',
                      '3DS Challenge',
                      'Authorization',
                      'Confirmation',
                    ].includes(session.stage),
                  ).length,
                  percentOfOriginal:
                    (mockCheckoutSessions.filter((session) =>
                      [
                        'Payment Method Selection',
                        'Payment Details Entry',
                        '3DS Challenge',
                        'Authorization',
                        'Confirmation',
                      ].includes(session.stage),
                    ).length /
                      mockCheckoutSessions.length) *
                    100,
                  dropOffRate:
                    ((mockCheckoutSessions.length -
                      mockCheckoutSessions.filter((session) =>
                        [
                          'Payment Method Selection',
                          'Payment Details Entry',
                          '3DS Challenge',
                          'Authorization',
                          'Confirmation',
                        ].includes(session.stage),
                      ).length) /
                      mockCheckoutSessions.length) *
                    100,
                },
                {
                  label: 'Details Entry',
                  reachedCount: mockCheckoutSessions.filter((session) =>
                    [
                      'Payment Details Entry',
                      '3DS Challenge',
                      'Authorization',
                      'Confirmation',
                    ].includes(session.stage),
                  ).length,
                  percentOfOriginal:
                    (mockCheckoutSessions.filter((session) =>
                      [
                        'Payment Details Entry',
                        '3DS Challenge',
                        'Authorization',
                        'Confirmation',
                      ].includes(session.stage),
                    ).length /
                      mockCheckoutSessions.length) *
                    100,
                  dropOffRate:
                    ((mockCheckoutSessions.filter((session) =>
                      [
                        'Payment Method Selection',
                        'Payment Details Entry',
                        '3DS Challenge',
                        'Authorization',
                        'Confirmation',
                      ].includes(session.stage),
                    ).length -
                      mockCheckoutSessions.filter((session) =>
                        [
                          'Payment Details Entry',
                          '3DS Challenge',
                          'Authorization',
                          'Confirmation',
                        ].includes(session.stage),
                      ).length) /
                      mockCheckoutSessions.filter((session) =>
                        [
                          'Payment Method Selection',
                          'Payment Details Entry',
                          '3DS Challenge',
                          'Authorization',
                          'Confirmation',
                        ].includes(session.stage),
                      ).length) *
                    100,
                },
                {
                  label: 'Authorization',
                  reachedCount: mockCheckoutSessions.filter((session) =>
                    ['Authorization', 'Confirmation'].includes(session.stage),
                  ).length,
                  percentOfOriginal:
                    (mockCheckoutSessions.filter((session) =>
                      ['Authorization', 'Confirmation'].includes(session.stage),
                    ).length /
                      mockCheckoutSessions.length) *
                    100,
                  dropOffRate:
                    ((mockCheckoutSessions.filter((session) =>
                      [
                        'Payment Details Entry',
                        '3DS Challenge',
                        'Authorization',
                        'Confirmation',
                      ].includes(session.stage),
                    ).length -
                      mockCheckoutSessions.filter((session) =>
                        ['Authorization', 'Confirmation'].includes(
                          session.stage,
                        ),
                      ).length) /
                      mockCheckoutSessions.filter((session) =>
                        [
                          'Payment Details Entry',
                          '3DS Challenge',
                          'Authorization',
                          'Confirmation',
                        ].includes(session.stage),
                      ).length) *
                    100,
                },
                {
                  label: 'Success',
                  reachedCount: mockCheckoutSessions.filter(
                    (session) => session.stage === 'Confirmation',
                  ).length,
                  percentOfOriginal:
                    (mockCheckoutSessions.filter(
                      (session) => session.stage === 'Confirmation',
                    ).length /
                      mockCheckoutSessions.length) *
                    100,
                  dropOffRate: 0,
                },
              ].map((step) => (
                <div
                  key={step.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {step.label}
                    </span>
                    <span className="text-sm font-medium text-slate-600">
                      {step.reachedCount} reached
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>
                      {step.percentOfOriginal.toFixed(1)}% of original sessions
                    </span>
                    <span>{step.dropOffRate.toFixed(1)}% drop-off</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-slate-800"
                      style={{
                        width: `${Math.max(8, step.percentOfOriginal)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Decline Analysis</h2>
            <p className="mt-3 text-sm text-slate-600">
              See the current stage&apos;s contribution to declines and failed
              authorizations.
            </p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Overall auth rate
                  </span>
                  <span className="text-lg font-semibold text-emerald-600">
                    {(
                      (mockCheckoutSessions.filter(
                        (session) => session.authOutcome === 'approved',
                      ).length /
                        mockCheckoutSessions.length) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Failure reasons
                  </span>
                  <span className="text-sm text-slate-500">by count</span>
                </div>
                {Object.entries(
                  mockCheckoutSessions.reduce<Record<string, number>>(
                    (acc, session) => {
                      if (session.declineCode) {
                        acc[session.declineCode] =
                          (acc[session.declineCode] ?? 0) + 1;
                      }
                      return acc;
                    },
                    {},
                  ),
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([reason, count]) => (
                    <div
                      key={reason}
                      className="mb-2 rounded-xl border border-slate-200 bg-white p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">
                          {reason}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Method failure rates
                  </span>
                  <span className="text-sm text-slate-500">
                    auth success vs. failure
                  </span>
                </div>
                {(['credit_card', 'pse', 'cash'] as const).map((method) => {
                  const methodSessions = mockCheckoutSessions.filter(
                    (session) => session.paymentMethod === method,
                  );
                  const authAttempts = methodSessions.filter(
                    (session) =>
                      session.authOutcome === 'approved' ||
                      session.authOutcome === 'declined',
                  );
                  const successCount = authAttempts.filter(
                    (session) => session.authOutcome === 'approved',
                  ).length;
                  const authRate = authAttempts.length
                    ? (successCount / authAttempts.length) * 100
                    : 0;
                  const isHighImpact =
                    method === 'credit_card' || method === 'pse';

                  return (
                    <div
                      key={method}
                      className={`mb-2 rounded-xl border p-3 ${isHighImpact ? 'border-rose-200 bg-rose-50' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize text-slate-700">
                          {method.replace('_', ' ')}
                        </span>
                        <span
                          className={`font-semibold ${authRate >= 85 ? 'text-emerald-600' : authRate >= 70 ? 'text-amber-600' : 'text-rose-600'}`}
                        >
                          {authRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200">
                        <div
                          className={`h-2 rounded-full ${authRate >= 85 ? 'bg-emerald-500' : authRate >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.max(8, authRate)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Time-based Comparison</h2>
            <p className="mt-3 text-sm text-slate-600">
              Compare this stage before and after the change point in the mock
              data.
            </p>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">
                  3 weeks ago
                </span>
                <span className="text-sm font-medium text-slate-500">
                  This week
                </span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-sm text-slate-500">Stage volume</p>
                  <p className="mt-1 text-xl font-semibold">{early.volume}</p>
                  <p className="text-sm text-slate-600">
                    → {late.volume} ({volumeDelta >= 0 ? '+' : ''}
                    {volumeDelta})
                  </p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-sm text-slate-500">Success rate</p>
                  <p className="mt-1 text-xl font-semibold">
                    {early.successRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-slate-600">
                    → {late.successRate.toFixed(1)}% (
                    {rateDelta >= 0 ? '+' : ''}
                    {rateDelta.toFixed(1)} pts)
                  </p>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
                <span className="font-semibold">{stageName}</span> {direction}{' '}
                over the last three weeks and stage volume {volumeDirection}.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
