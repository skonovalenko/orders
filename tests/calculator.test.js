"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const calculator_1 = require("../src/calculator");
(0, vitest_1.describe)('OrderCalculator', () => {
    const standardRules = [
        { threshold: 200, percentage: 0.2 },
        { threshold: 100, percentage: 0.1 },
    ];
    (0, vitest_1.describe)('calculateProductTotal', () => {
        (0, vitest_1.it)('should calculate product total without discount when below threshold', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const product = { name: 'Widget', price: 10, quantity: 5 };
            const result = calculator.calculateProductTotal(product);
            (0, vitest_1.expect)(result.subtotal).toBe(50);
            (0, vitest_1.expect)(result.discount).toBe(0);
            (0, vitest_1.expect)(result.total).toBe(50);
        });
        (0, vitest_1.it)('should apply 10% discount at exactly 100 boundary', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const product = { name: 'Widget', price: 50, quantity: 2 };
            const result = calculator.calculateProductTotal(product);
            (0, vitest_1.expect)(result.subtotal).toBe(100);
            (0, vitest_1.expect)(result.discount).toBe(10);
            (0, vitest_1.expect)(result.total).toBe(90);
        });
        (0, vitest_1.it)('should apply 10% discount for values between 100 and 199.99', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const product = { name: 'Widget', price: 19.99, quantity: 10 };
            const result = calculator.calculateProductTotal(product);
            (0, vitest_1.expect)(result.subtotal).toBeCloseTo(199.9, 2);
            (0, vitest_1.expect)(result.discount).toBeCloseTo(19.99, 2);
            (0, vitest_1.expect)(result.total).toBeCloseTo(179.91, 2);
        });
        (0, vitest_1.it)('should apply 20% discount at exactly 200 boundary', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const product = { name: 'Widget', price: 100, quantity: 2 };
            const result = calculator.calculateProductTotal(product);
            (0, vitest_1.expect)(result.subtotal).toBe(200);
            (0, vitest_1.expect)(result.discount).toBe(40);
            (0, vitest_1.expect)(result.total).toBe(160);
        });
        (0, vitest_1.it)('should apply 20% discount for values above 200', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const product = { name: 'Premium Widget', price: 150, quantity: 3 };
            const result = calculator.calculateProductTotal(product);
            (0, vitest_1.expect)(result.subtotal).toBe(450);
            (0, vitest_1.expect)(result.discount).toBe(90);
            (0, vitest_1.expect)(result.total).toBe(360);
        });
        (0, vitest_1.it)('should handle floating point prices correctly', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const product = { name: 'Widget', price: 19.99, quantity: 11 };
            const result = calculator.calculateProductTotal(product);
            (0, vitest_1.expect)(result.subtotal).toBeCloseTo(219.89, 2);
            (0, vitest_1.expect)(result.discount).toBeCloseTo(43.978, 2);
            (0, vitest_1.expect)(result.total).toBeCloseTo(175.912, 2);
        });
    });
    (0, vitest_1.describe)('calculateOrder', () => {
        (0, vitest_1.it)('should calculate order with mixed products at different discount tiers', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const products = [
                { name: 'Cheap Item', price: 10, quantity: 5 }, // 50 - no discount
                { name: 'Mid Item', price: 30, quantity: 4 }, // 120 - 10% discount
                { name: 'Expensive Item', price: 100, quantity: 3 }, // 300 - 20% discount
            ];
            const result = calculator.calculateOrder(products);
            (0, vitest_1.expect)(result.totalQuantity).toBe(12);
            (0, vitest_1.expect)(result.totalPrice).toBe(470);
            (0, vitest_1.expect)(result.totalDiscount).toBe(72); // 0 + 12 + 60
            (0, vitest_1.expect)(result.finalTotal).toBe(398);
        });
        (0, vitest_1.it)('should handle empty product list', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const products = [];
            const result = calculator.calculateOrder(products);
            (0, vitest_1.expect)(result.totalQuantity).toBe(0);
            (0, vitest_1.expect)(result.totalPrice).toBe(0);
            (0, vitest_1.expect)(result.totalDiscount).toBe(0);
            (0, vitest_1.expect)(result.finalTotal).toBe(0);
        });
        (0, vitest_1.it)('should work with no discount rules configured', () => {
            const calculator = new calculator_1.OrderCalculator([]);
            const products = [
                { name: 'Widget', price: 100, quantity: 3 },
            ];
            const result = calculator.calculateOrder(products);
            (0, vitest_1.expect)(result.totalPrice).toBe(300);
            (0, vitest_1.expect)(result.totalDiscount).toBe(0);
            (0, vitest_1.expect)(result.finalTotal).toBe(300);
        });
        (0, vitest_1.it)('should handle products with fractional quantities if needed', () => {
            const calculator = new calculator_1.OrderCalculator(standardRules);
            const products = [
                { name: 'Bulk Item', price: 50.50, quantity: 2.5 },
            ];
            const result = calculator.calculateOrder(products);
            (0, vitest_1.expect)(result.totalPrice).toBeCloseTo(126.25, 2);
            (0, vitest_1.expect)(result.totalDiscount).toBeCloseTo(12.625, 2);
            (0, vitest_1.expect)(result.finalTotal).toBeCloseTo(113.625, 2);
        });
    });
});
