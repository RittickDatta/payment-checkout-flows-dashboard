import { mockCheckoutSessions } from '@/app/data/mock-data';

const declineReasonLabels = {
  insufficient_funds: 'Insufficient funds',
  suspected_fraud: 'Suspected fraud',
  card_expired: 'Card expired',
  network_timeout: 'Network timeout',
  issuer_unavailable: 'Issuer unavailable',
  cvv_mismatch: 'CVV mismatch',
  transaction_not_permitted: 'Transaction not permitted',
  do_not_honor: 'Do not honor',
};

export default function DeclineAnalysisPage() {
  const authorizationAttempts = mockCheckoutSessions.filter(
    (session) =>
      session.stage === 'Authorization' || session.stage === 'Confirmation',
  );
  const successfulAuthorizations = authorizationAttempts.filter(
    (session) => session.authOutcome === 'approved',
  );
  const overallAuthorizationRate =
    authorizationAttempts.length === 0
      ? 0
      : (successfulAuthorizations.length / authorizationAttempts.length) * 100;

  const declineBreakdown = mockCheckoutSessions.reduce<Record<string, number>>(
    (acc, session) => {
      if (session.declineCode) {
        acc[session.declineCode] = (acc[session.declineCode] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  const methodMetrics = ['credit_card', 'pse', 'cash'].map((method) => {
    const methodSessions = mockCheckoutSessions.filter(
      (session) => session.paymentMethod === method,
    );
    const methodAuthAttempts = methodSessions.filter(
      (session) =>
        session.stage === 'Authorization' || session.stage === 'Confirmation',
    );
    const methodAuthSuccesses = methodAuthAttempts.filter(
      (session) => session.authOutcome === 'approved',
    );
    const authRate =
      methodAuthAttempts.length === 0
        ? 0
        : (methodAuthSuccesses.length / methodAuthAttempts.length) * 100;
    const failures = methodSessions.filter(
      (session) => session.authOutcome === 'declined',
    ).length;

    return {
      method,
      authRate,
      failures,
      total: methodSessions.length,
    };
  });

  const highestFailureMethod = [...methodMetrics].sort(
    (a, b) => b.failures - a.failures,
  )[0];
  const highestAuthMethod = [...methodMetrics].sort(
    (a, b) => b.authRate - a.authRate,
  )[0];

  const declineEntries = Object.entries(declineBreakdown).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Decline Analysis
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Payment failure patterns
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Review the reasons behind failed payments, compare authorization
            outcomes by payment method, and spot the biggest drop-offs quickly.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Overall Auth Rate
            </p>
            <p className="mt-2 text-3xl font-semibold">
              {overallAuthorizationRate.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Highest Failure Method
            </p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">
              {highestFailureMethod?.method ?? 'n/a'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Top Auth Method
            </p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">
              {highestAuthMethod?.method ?? 'n/a'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Failed payment reasons</h2>
            <div className="mt-4 space-y-3">
              {declineEntries.map(([reason, count]) => (
                <div
                  key={reason}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {declineReasonLabels[
                        reason as keyof typeof declineReasonLabels
                      ] ?? reason}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {count} cases
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Authorization rate by payment method
            </h2>
            <div className="mt-4 space-y-4">
              {methodMetrics.map((metric) => {
                const isHighlighted =
                  metric.method === 'pse' || metric.method === 'credit_card';
                const barWidth = Math.max(8, metric.authRate);
                return (
                  <div
                    key={metric.method}
                    className="rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">
                        {metric.method.replace('_', ' ')}
                      </span>
                      <span
                        className={`font-semibold ${metric.authRate >= 85 ? 'text-emerald-600' : metric.authRate >= 70 ? 'text-amber-600' : 'text-rose-600'}`}
                      >
                        {metric.authRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-slate-200">
                      <div
                        className={`h-3 rounded-full ${isHighlighted ? (metric.authRate >= 85 ? 'bg-emerald-500' : metric.authRate >= 70 ? 'bg-amber-500' : 'bg-rose-500') : 'bg-slate-500'}`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {metric.failures} failed attempts out of {metric.total}{' '}
                      sessions
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
