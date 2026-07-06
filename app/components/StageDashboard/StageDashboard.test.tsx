import { render, screen } from '@testing-library/react';
import StageDashboard from './StageDashboard';

describe('StageDashboard', () => {
  it('renders stage analysis header for a known slug', () => {
    render(<StageDashboard stage="payment-details-entry" />);

    expect(screen.getByText(/stage analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/payment details entry/i)).toBeInTheDocument();
  });

  it('renders fallback stage label for unknown slug and avoids division by zero', () => {
    render(<StageDashboard stage="unknown-stage" />);

    expect(screen.getByText(/unknown stage/i)).toBeInTheDocument();
    expect(screen.getByText(/0%/i)).toBeInTheDocument();
  });

  it('renders time-based comparison section', () => {
    render(<StageDashboard stage="cart-review" />);

    expect(screen.getByText(/time-based comparison/i)).toBeInTheDocument();
    expect(screen.getByText(/3 weeks ago/i)).toBeInTheDocument();
  });
});
