import { describe, it, expect } from 'vitest';
import { OrderCalculator } from '../src/calculator';
import { Product, DiscountRule } from '../src/types';

describe('OrderCalculator', () => {
    const standardRules: DiscountRule[] = [
        { threshold: 200, percentage: 0.2 },
        { threshold: 100, percentage: 0.1 },
    ];

    describe('calculateProductTotal', () => {
        it('should calculate product total without discount when below threshold', () => {
            const calculator = new OrderCalculator(standardRules);
            const product: Product = { name: 'Widget', price: 10, quantity: 5 };

            const result = calculator.calculateProductTotal(product);

            expect(result.subtotal).toBe(50);
            expect(result.discount).toBe(0);
            expect(result.total).toBe(50);
        });

        it('should apply 10% discount at exactly 100 boundary', () => {
            const calculator = new OrderCalculator(standardRules);
            const product: Product = { name: 'Widget', price: 50, quantity: 2 };

            const result = calculator.calculateProductTotal(product);

            expect(result.subtotal).toBe(100);
            expect(result.discount).toBe(10);
            expect(result.total).toBe(90);
        });

        it('should apply 10% discount for values between 100 and 199.99', () => {
            const calculator = new OrderCalculator(standardRules);
            const product: Product = { name: 'Widget', price: 19.99, quantity: 10 };

            const result = calculator.calculateProductTotal(product);

            expect(result.subtotal).toBeCloseTo(199.9, 2);
            expect(result.discount).toBeCloseTo(19.99, 2);
            expect(result.total).toBeCloseTo(179.91, 2);
        });

        it('should apply 20% discount at exactly 200 boundary', () => {
            const calculator = new OrderCalculator(standardRules);
            const product: Product = { name: 'Widget', price: 100, quantity: 2 };

            const result = calculator.calculateProductTotal(product);

            expect(result.subtotal).toBe(200);
            expect(result.discount).toBe(40);
            expect(result.total).toBe(160);
        });

        it('should apply 20% discount for values above 200', () => {
            const calculator = new OrderCalculator(standardRules);
            const product: Product = { name: 'Premium Widget', price: 150, quantity: 3 };

            const result = calculator.calculateProductTotal(product);

            expect(result.subtotal).toBe(450);
            expect(result.discount).toBe(90);
            expect(result.total).toBe(360);
        });

        it('should handle floating point prices correctly', () => {
            const calculator = new OrderCalculator(standardRules);
            const product: Product = { name: 'Widget', price: 19.99, quantity: 11 };

            const result = calculator.calculateProductTotal(product);

            expect(result.subtotal).toBeCloseTo(219.89, 2);
            expect(result.discount).toBeCloseTo(43.978, 2);
            expect(result.total).toBeCloseTo(175.912, 2);
        });
    });

    describe('calculateOrder', () => {
        it('should calculate order with mixed products at different discount tiers', () => {
            const calculator = new OrderCalculator(standardRules);
            const products: Product[] = [
                { name: 'Cheap Item', price: 10, quantity: 5 },      // 50 - no discount
                { name: 'Mid Item', price: 30, quantity: 4 },        // 120 - 10% discount
                { name: 'Expensive Item', price: 100, quantity: 3 }, // 300 - 20% discount
            ];

            const result = calculator.calculateOrder(products);

            expect(result.totalQuantity).toBe(12);
            expect(result.totalPrice).toBe(470);
            expect(result.totalDiscount).toBe(72); // 0 + 12 + 60
            expect(result.finalTotal).toBe(398);
        });

        it('should handle empty product list', () => {
            const calculator = new OrderCalculator(standardRules);
            const products: Product[] = [];

            const result = calculator.calculateOrder(products);

            expect(result.totalQuantity).toBe(0);
            expect(result.totalPrice).toBe(0);
            expect(result.totalDiscount).toBe(0);
            expect(result.finalTotal).toBe(0);
        });

        it('should work with no discount rules configured', () => {
            const calculator = new OrderCalculator([]);
            const products: Product[] = [
                { name: 'Widget', price: 100, quantity: 3 },
            ];

            const result = calculator.calculateOrder(products);

            expect(result.totalPrice).toBe(300);
            expect(result.totalDiscount).toBe(0);
            expect(result.finalTotal).toBe(300);
        });

        it('should handle products with fractional quantities if needed', () => {
            const calculator = new OrderCalculator(standardRules);
            const products: Product[] = [
                { name: 'Bulk Item', price: 50.50, quantity: 2.5 },
            ];

            const result = calculator.calculateOrder(products);

            expect(result.totalPrice).toBeCloseTo(126.25, 2);
            expect(result.totalDiscount).toBeCloseTo(12.625, 2);
            expect(result.finalTotal).toBeCloseTo(113.625, 2);
        });
    });
});