import { render, screen } from '@testing-library/react';
import CheckoutFlowStage from './CheckoutFlowStage';

describe('CheckoutFlowStage', () => {
  it('renders correct stage title and description', () => {
    render(
      <CheckoutFlowStage
        stage="Payment Details Entry"
        colorClass="bg-emerald-100 border-emerald-300 text-emerald-900"
        href="/stages/payment-details-entry"
      />,
    );

    expect(
      screen.getByRole('link', { name: /payment details entry/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/users enter billing and payment information/i),
    ).toBeInTheDocument();
  });

  it('renders fallback description for unknown stage', () => {
    render(
      <CheckoutFlowStage
        stage={'Unknown Stage' as any}
        colorClass="bg-slate-100 border-slate-300 text-slate-900"
        href="/stages/unknown-stage"
      />,
    );

    expect(screen.getByText('Payment flow milestone.')).toBeInTheDocument();
  });
});
