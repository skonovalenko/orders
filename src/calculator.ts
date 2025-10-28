import { Product, DiscountRule, ProductCalculation, OrderCalculation } from './types';

export class OrderCalculator {
    constructor(private discountRules: DiscountRule[] = []) {
        // Sort rules by threshold descending to apply highest applicable discount
        this.discountRules.sort((a, b) => b.threshold - a.threshold);
    }

    /**
     * Calculate discount for a given subtotal based on configured rules
     */
    private calculateDiscount(subtotal: number): number {
        for (const rule of this.discountRules) {
            if (subtotal >= rule.threshold) {
                return subtotal * rule.percentage;
            }
        }
        return 0;
    }

    /**
     * Calculate totals for a single product line
     */
    calculateProductTotal(product: Product): ProductCalculation {
        const subtotal = product.price * product.quantity;
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal - discount;

        return {
            productName: product.name,
            unitPrice: product.price,
            quantity: product.quantity,
            subtotal,
            discount,
            total,
        };
    }

    /**
     * Calculate complete order with all products
     */
    calculateOrder(products: Product[]): OrderCalculation {
        const productCalculations = products.map(product =>
            this.calculateProductTotal(product)
        );

        const totalQuantity = productCalculations.reduce(
            (sum, calc) => sum + calc.quantity,
            0
        );

        const totalPrice = productCalculations.reduce(
            (sum, calc) => sum + calc.subtotal,
            0
        );

        const totalDiscount = productCalculations.reduce(
            (sum, calc) => sum + calc.discount,
            0
        );

        const finalTotal = totalPrice - totalDiscount;

        return {
            products: productCalculations,
            totalQuantity,
            totalPrice,
            totalDiscount,
            finalTotal,
        };
    }
}