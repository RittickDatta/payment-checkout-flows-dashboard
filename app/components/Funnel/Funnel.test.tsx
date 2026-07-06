import { render, screen } from '@testing-library/react';
import Funnel from './Funnel';
import { mockCheckoutSessions } from '@/app/data/mock-data';

describe('Funnel', () => {
  it('renders funnel headings and stage cards', () => {
    render(<Funnel />);

    expect(screen.getByText(/payments funnel/i)).toBeInTheDocument();
    expect(screen.getByText(/cart review/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmation/i)).toBeInTheDocument();
  });

  it('shows stage session counts from mock data', () => {
    render(<Funnel />);

    const totalSessions = mockCheckoutSessions.length;
    expect(
      screen.getByText(`${totalSessions.toLocaleString()} sessions`),
    ).toBeInTheDocument();
  });

  it('shows drop-off values for each stage transition', () => {
    render(<Funnel />);

    expect(screen.getAllByText(/dropped off/i).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/% drop from previous stage/i).length,
    ).toBeGreaterThan(0);
  });
});
