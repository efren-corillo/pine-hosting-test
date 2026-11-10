export type SKU = string;

export interface Product {
    sku: SKU;
    name: string;
    priceInCents: number;
}

export interface BasketItem {
    sku: SKU;
    quantity: number;
}

export interface ReceiptLineItem {
    sku: SKU;
    name: string;
    quantity: number;
    unitPriceInCents: number;
    totalInCents: number;
}

export interface ReceiptDiscount {
    description: string;
    amountInCents: number; // positive value representing reduction
}

export interface Receipt {
    lineItems: ReceiptLineItem[];
    subtotalInCents: number;
    discounts: ReceiptDiscount[];
    totalInCents: number;
    formattedText: string;
}

export interface ItemOfferStrategy {
    appliesTo(sku: SKU): boolean;
    calculateDiscount(item: BasketItem, product: Product): ReceiptDiscount | null;
}

export interface BasketDiscountStrategy {
    code: string;
    calculateDiscount(currentTotalInCents: number): ReceiptDiscount | null;
}

/** POST /checkout request body. */
export interface CheckoutRequest {
    items: BasketItem[];
    discountCode?: string | null;
}

export interface CheckoutResponse {
    lineItems: ReceiptLineItem[];
    subtotalInCents: number;
    discounts: ReceiptDiscount[];
    totalInCents: number;
    formatted: { subtotal: string; total: string };
}

export type ErrorCode =
    | 'INVALID_BODY'
    | 'INVALID_ITEM'
    | 'UNKNOWN_SKU'
    | 'INVALID_DISCOUNT_CODE'
    | 'INTERNAL_ERROR';

export interface ApiError {
    code: ErrorCode;
    message: string;
}

export interface ApiResponse<T> {
    status: number;
    body: T | { error: ApiError };
}
