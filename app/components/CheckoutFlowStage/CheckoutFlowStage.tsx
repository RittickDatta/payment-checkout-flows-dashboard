import Link from 'next/link';
import { Stage } from '@/app/model/KeyMetrics';

type CheckoutFlowStageProps = {
  stage: Stage;
  colorClass: string;
  href: string;
  reachedCount: number;
  percentOfOriginal: number;
  dropOffCount: number;
  dropOffRate: number;
};

const getStageDescription = (stage: Stage) => {
  switch (stage) {
    case 'Cart Review':
      return 'Customers confirm their basket before moving to payment.';
    case 'Payment Method Selection':
      return 'Buyers choose their preferred way to pay.';
    case 'Payment Details Entry':
      return 'Users enter billing and payment information.';
    case '3DS Challenge':
      return 'Extra verification is required to protect the transaction.';
    case 'Authorization':
      return 'The payment provider evaluates the transaction request.';
    case 'Confirmation':
      return 'The order is finalized and the payment is accepted.';
    default:
      return 'Payment flow milestone.';
  }
};

export default function CheckoutFlowStage({
  stage,
  colorClass,
  href,
  reachedCount,
  percentOfOriginal,
  dropOffCount,
  dropOffRate,
}: CheckoutFlowStageProps) {
  return (
    <Link
      href={href}
      className={`block w-full max-w-full rounded-2xl border p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 ${colorClass}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
        {stage}
      </p>
      <h3 className="mt-3 text-lg font-semibold">{stage}</h3>
      <p className="mt-2 text-sm opacity-80">{getStageDescription(stage)}</p>

      <div className="mt-4 w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Dropped off
        </p>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {dropOffCount.toLocaleString()} dropped off
          <span className="ml-2 text-slate-500">
            ({dropOffRate.toFixed(1)}% from previous stage)
          </span>
        </p>
      </div>

      <p className="mt-4 text-sm text-slate-700">
        {reachedCount.toLocaleString()} sessions
        <span className="ml-2 text-slate-500">
          ({percentOfOriginal.toFixed(0)}% of total)
        </span>
      </p>
    </Link>
  );
}
