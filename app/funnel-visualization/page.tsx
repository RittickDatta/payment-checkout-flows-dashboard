import { mockCheckoutSessions } from '@/app/data/mock-data';

type FunnelStageSummary = {
  label: string;
  description: string;
  reachedCount: number;
  percentOfOriginal: number;
  dropOffCount: number;
  dropOffRate: number;
  isHighestDropOff: boolean;
};

const stageDefinitions = [
  {
    label: 'Cart',
    matcher: () => true,
    description: 'All checkout sessions begin here.',
  },
  {
    label: 'Method Selection',
    matcher: (stage: string) =>
      [
        'Payment Method Selection',
        'Payment Details Entry',
        '3DS Challenge',
        'Authorization',
        'Confirmation',
      ].includes(stage),
    description: 'Customers selected a payment method.',
  },
  {
    label: 'Details Entry',
    matcher: (stage: string) =>
      [
        'Payment Details Entry',
        '3DS Challenge',
        'Authorization',
        'Confirmation',
      ].includes(stage),
    description: 'Customers entered payment details.',
  },
  {
    label: 'Authorization',
    matcher: (stage: string) =>
      ['Authorization', 'Confirmation'].includes(stage),
    description: 'Transactions moved to authorization.',
  },
  {
    label: 'Success',
    matcher: (stage: string) => stage === 'Confirmation',
    description: 'Payments were confirmed successfully.',
  },
];

export default function FunnelVisualizationPage() {
  const totalSessions = mockCheckoutSessions.length;

  const stageSummaries: FunnelStageSummary[] = stageDefinitions.map(
    (stage) => ({
      label: stage.label,
      description: stage.description,
      reachedCount: mockCheckoutSessions.filter((session) =>
        stage.matcher(session.stage),
      ).length,
      percentOfOriginal:
        (mockCheckoutSessions.filter((session) => stage.matcher(session.stage))
          .length /
          totalSessions) *
        100,
      dropOffCount: 0,
      dropOffRate: 0,
      isHighestDropOff: false,
    }),
  );

  const summariesWithDropOff = stageSummaries.map((stage, index) => {
    if (index === stageSummaries.length - 1) {
      return {
        ...stage,
        dropOffCount: 0,
        dropOffRate: 0,
        isHighestDropOff: false,
      };
    }

    const nextStageCount = stageSummaries[index + 1].reachedCount;
    const dropOffCount = stage.reachedCount - nextStageCount;
    const dropOffRate =
      stage.reachedCount === 0 ? 0 : (dropOffCount / stage.reachedCount) * 100;

    return {
      ...stage,
      dropOffCount,
      dropOffRate,
    };
  });

  const highestDropOffStage = summariesWithDropOff.reduce(
    (highest, current) => {
      if (current.dropOffRate > highest.dropOffRate) {
        return current;
      }
      return highest;
    },
    summariesWithDropOff[0],
  );

  const highlightedStage = summariesWithDropOff.map((stage) => ({
    ...stage,
    isHighestDropOff: stage.label === highestDropOffStage?.label,
  }));

  const highestDropOffStageLabel = highestDropOffStage?.label ?? 'Cart';

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Funnel Visualization
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Checkout conversion funnel
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            This view shows how many sessions reached each stage, what share of
            the original sessions they represent, and where the largest drop-off
            happens.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Sessions</p>
            <p className="mt-2 text-3xl font-semibold">{totalSessions}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Highest Drop-off
            </p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">
              {highestDropOffStageLabel}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Peak Loss</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">
              {highestDropOffStage?.dropOffRate.toFixed(1) ?? '0.0'}%
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {highlightedStage.map((stage) => (
            <div
              key={stage.label}
              className={`rounded-2xl border p-5 shadow-sm ${
                stage.isHighestDropOff
                  ? 'border-rose-300 bg-rose-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">{stage.label}</h2>
                    {stage.isHighestDropOff && (
                      <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        Highest drop-off
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {stage.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm">
                    <div className="font-semibold text-slate-900">
                      {stage.reachedCount}
                    </div>
                    <div className="text-slate-500">sessions reached</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm">
                    <div className="font-semibold text-slate-900">
                      {stage.percentOfOriginal.toFixed(1)}%
                    </div>
                    <div className="text-slate-500">of original sessions</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm">
                    <div className="font-semibold text-slate-900">
                      {stage.dropOffCount}
                    </div>
                    <div className="text-slate-500">drop-off to next</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 h-3 rounded-full bg-slate-200">
                <div
                  className={`h-3 rounded-full ${stage.isHighestDropOff ? 'bg-rose-500' : 'bg-slate-800'}`}
                  style={{ width: `${Math.max(8, stage.percentOfOriginal)}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>
                  {stage.percentOfOriginal.toFixed(1)}% of original sessions
                  reached
                </span>
                <span>
                  {stage.dropOffRate.toFixed(1)}% drop-off to next stage
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
