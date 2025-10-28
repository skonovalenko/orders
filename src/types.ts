export interface Product {
    name: string;
    price: number;
    quantity: number;
}

export interface DiscountRule {
    threshold: number;
    percentage: number;
}

export interface ProductCalculation {
    productName: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    discount: number;
    total: number;
}

export interface OrderCalculation {
    products: ProductCalculation[];
    totalQuantity: number;
    totalPrice: number;
    totalDiscount: number;
    finalTotal: number;
}

export interface FormatOptions {
    locale: string;
    currency: string;
}