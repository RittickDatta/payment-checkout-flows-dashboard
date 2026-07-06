export type Stage = "Cart Review" | "Payment Method Selection" | "Payment Details Entry" | "3DS Challenge" | "Authorization" | "Confirmation"

export type KeyMetrics = {
    CoversionRate: number;
    DropOffRate: number;
    AuthorizationRate: number;
    PaymentMethod: Stage
}