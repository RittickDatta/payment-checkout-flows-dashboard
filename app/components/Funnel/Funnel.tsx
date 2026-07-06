import CheckoutFlowStage from '../CheckoutFlowStage/CheckoutFlowStage';
import { mockCheckoutSessions } from '@/app/data/mock-data';
import { Stage } from '@/app/model/KeyMetrics';

const stageSteps: Array<{
  stage: Stage;
  colorClass: string;
  href: string;
  matcher: (stage: string) => boolean;
}> = [
  {
    stage: 'Cart Review',
    colorClass: 'bg-slate-100 border-slate-300 text-slate-900',
    href: '/stages/cart-review',
    matcher: () => true,
  },
  {
    stage: 'Payment Method Selection',
    colorClass: 'bg-amber-100 border-amber-300 text-amber-900',
    href: '/stages/payment-method-selection',
    matcher: (stage) =>
      [
        'Payment Method Selection',
        'Payment Details Entry',
        '3DS Challenge',
        'Authorization',
        'Confirmation',
      ].includes(stage),
  },
  {
    stage: 'Payment Details Entry',
    colorClass: 'bg-emerald-100 border-emerald-300 text-emerald-900',
    href: '/stages/payment-details-entry',
    matcher: (stage) =>
      [
        'Payment Details Entry',
        '3DS Challenge',
        'Authorization',
        'Confirmation',
      ].includes(stage),
  },
  {
    stage: '3DS Challenge',
    colorClass: 'bg-violet-100 border-violet-300 text-violet-900',
    href: '/stages/3ds-challenge',
    matcher: (stage) =>
      ['3DS Challenge', 'Authorization', 'Confirmation'].includes(stage),
  },
  {
    stage: 'Authorization',
    colorClass: 'bg-rose-100 border-rose-300 text-rose-900',
    href: '/stages/authorization',
    matcher: (stage) => ['Authorization', 'Confirmation'].includes(stage),
  },
  {
    stage: 'Confirmation',
    colorClass: 'bg-sky-100 border-sky-300 text-sky-900',
    href: '/stages/confirmation',
    matcher: (stage) => stage === 'Confirmation',
  },
];

export default function Funnel() {
  const totalSessions = mockCheckoutSessions.length;
  const stageStats = stageSteps.map((step) => {
    const reachedCount = mockCheckoutSessions.filter((session) =>
      step.matcher(session.stage),
    ).length;
    return {
      ...step,
      reachedCount,
      percentOfOriginal: totalSessions
        ? (reachedCount / totalSessions) * 100
        : 0,
    };
  });

  const dropOffs = stageStats.slice(0, -1).map((current, index) => {
    const next = stageStats[index + 1];
    const dropOffCount = current.reachedCount - next.reachedCount;
    const dropOffRate = current.reachedCount
      ? (dropOffCount / current.reachedCount) * 100
      : 0;
    return {
      dropOffCount,
      dropOffRate,
    };
  });

  return (
    <section className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Payments Funnel
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Checkout flow stages
        </h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 overflow-x-auto">
        {stageStats.map((item, index) => (
          <div
            key={item.stage}
            className="flex items-center gap-4"
          >
            <div className="flex flex-col items-center gap-2">
              <CheckoutFlowStage
                stage={item.stage}
                colorClass={item.colorClass}
                href={item.href}
              />
              <p className="text-sm text-slate-600">
                {item.reachedCount.toLocaleString()} sessions
                <span className="ml-2 text-slate-400">
                  ({item.percentOfOriginal.toFixed(0)}% of total)
                </span>
              </p>
            </div>

            {index < stageStats.length - 1 && (
              <div className="flex min-w-[160px] flex-col items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-700 shadow-sm">
                <span className="font-semibold text-slate-900">
                  {dropOffs[index].dropOffCount.toLocaleString()} dropped off
                </span>
                <span className="text-slate-500">
                  {dropOffs[index].dropOffRate.toFixed(1)}% drop from previous
                  stage
                </span>
                <div className="mt-2 text-2xl font-bold text-slate-400">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
