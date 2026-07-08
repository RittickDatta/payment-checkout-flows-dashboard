# payment-checkout-flows-dashboard

## Live Website Link
https://payment-checkout-flows-dashboard-3anirfa2k.vercel.app/

## Overview

This project is a checkout funnel analytics dashboard built with Next.js and TypeScript. It uses realistic mock checkout session data to show how users progress through the payment flow, where they drop off, and how authorization outcomes affect conversion.

## How to run the application

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## What to look for in the dashboard

- **Funnel stage progression**: See how many sessions reach each stage from Cart Review through Confirmation.
- **Drop-off points**: Check the numeric and percentage drop-off between adjacent stages to identify where customers exit the checkout flow.
- **Stage-level insights**: Visit individual stage pages to inspect payment method performance, authorization success/failure, and decline trends.
- **Decline analysis**: Understand which authorization failures are most common and how they impact the overall checkout completion rate.
- **Time-based comparison**: Review whether specific stages are improving or worsening over time based on mock time-series metrics.

## Approach and design decisions

- **Data-driven UI**: The dashboard is powered by a centralized mock dataset in `app/data/mock-data.ts`, ensuring all components render real values instead of placeholders.
- **Stage-based navigation**: Each funnel stage is surfaced as a clickable card, with dedicated detail pages for deeper analysis.
- **Clear drop-off visualization**: The funnel view shows both absolute drop-off counts and percentage changes between stages to make churn easy to interpret.
- **Modular components**: Reusable components like `CheckoutFlowStage` and `StageDashboard` keep the interface consistent and easier to extend.
- **Simple but scalable structure**: The app is built with core Next.js routing and a lightweight design system using utility classes.

## What I would add with more time

- **Real backend integration**: Replace mock data with a live API or analytics backend for production-ready insights.
- **Interactive filters**: Add filters for date range, payment method, geography, and customer segment.
- **More advanced visualizations**: Include heatmaps, conversion curves, and cohort retention charts.
- **Anomaly detection**: Add alerts or flags when drop-off rates spike unexpectedly.
- **Accessibility improvements**: Enhance keyboard navigation, screen reader labels, and contrast for a more inclusive UI.

## Brief summary

The mock data shows that TiendaMax is losing the largest share of users before they complete payment, with significant drop-off occurring between payment method selection and payment details entry. A smaller but meaningful portion of sessions fail during the 3DS challenge and authorization stages, suggesting friction around verification and payment acceptance. Overall conversion is limited by checkout abandonments and payment failures, making the payment flow the primary area for optimization.
