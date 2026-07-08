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

      <div className="flex flex-col gap-4 overflow-x-hidden md:flex-row md:flex-wrap md:items-center md:justify-between">
        {stageStats.map((item, index) => (
          <div
            key={item.stage}
            className="flex w-full flex-col items-stretch md:w-full"
          >
            <CheckoutFlowStage
              stage={item.stage}
              colorClass={item.colorClass}
              href={item.href}
              reachedCount={item.reachedCount}
              percentOfOriginal={item.percentOfOriginal}
              dropOffCount={dropOffs[index]?.dropOffCount ?? 0}
              dropOffRate={dropOffs[index]?.dropOffRate ?? 0}
            />

            {index < stageStats.length - 1 && (
              <div className="mt-3 text-2xl font-bold text-slate-400 flex justify-center">↓</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
