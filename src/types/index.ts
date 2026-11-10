export type SKU = string;

/**
 * A single product that can be added to the basket.
 */
export interface Product {
    sku: SKU;
    name: string;
    priceInCents: number;
}

/**
 * An item added to the basket.
 */
export interface BasketItem {
    sku: SKU;
    quantity: number;
}

/** 
 * A single line item on the receipt.
 */
export interface ReceiptLineItem {
    sku: SKU;
    name: string;
    quantity: number;
    unitPriceInCents: number;
    totalInCents: number;
}

/**
 * A discount applied to the receipt.
 */
export interface ReceiptDiscount {
    description: string;
    amountInCents: number; // positive value representing reduction
}

/**
 * The final receipt.
 */
export interface Receipt {
    lineItems: ReceiptLineItem[];
    subtotalInCents: number;
    discounts: ReceiptDiscount[];
    totalInCents: number;
    formattedText: string;
}

/**
 * A per-item offer (e.g. "buy 2 for the price of 1") applied to basket items.
 */
export interface ItemOfferStrategy {
    /** Returns true if this offer applies to the given SKU. */
    appliesTo(sku: SKU): boolean;
    /** Returns the discount for the item, or null if no discount is earned. */
    calculateDiscount(sku: SKU, quantity: number, unitPriceInCents: number): ReceiptDiscount | null;
}

/**
 * A basket-wide discount redeemed via a discount code.
 */
export interface BasketDiscountStrategy {
    /** The code the customer enters to redeem this discount. */
    code: string;
    /** Returns the discount for the current total (in cents), or null if not applicable. */
    calculateDiscount(currentTotalInCents: number): ReceiptDiscount | null;
}

/** POST /checkout request body. */
export interface CheckoutRequest {
    items: BasketItem[];
    discountCode?: string | null;
}

/** Alias for CheckoutRequest used by CheckoutService. */
export type CheckoutPayload = CheckoutRequest;

/** POST /checkout response body. */
export interface CheckoutResponse {
    lineItems: ReceiptLineItem[];
    subtotalInCents: number;
    discounts: ReceiptDiscount[];
    totalInCents: number;
    /** Human-readable currency strings for display. */
    formatted: { subtotal: string; total: string };
}

/**
 * Machine-readable error codes returned by the API.
 */
export type ErrorCode =
    | 'INVALID_BODY'
    | 'INVALID_ITEM'
    | 'UNKNOWN_SKU'
    | 'INVALID_DISCOUNT_CODE'
    | 'INTERNAL_ERROR';

/**
 * An error payload returned when a request fails.
 */
export interface ApiError {
    code: ErrorCode;
    message: string;
}

/**
 * Generic API response: an HTTP status plus either the success body `T` or an error.
 */
export interface ApiResponse<T> {
    status: number;
    body: T | { error: ApiError };
}
