"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const formatter_1 = require("../src/formatter");
(0, vitest_1.describe)('OrderFormatter', () => {
    (0, vitest_1.describe)('formatCurrency with different locales', () => {
        (0, vitest_1.it)('should format currency in en-US locale with USD', () => {
            const formatter = new formatter_1.OrderFormatter({ locale: 'en-US', currency: 'USD' });
            const orderCalc = {
                products: [{
                        productName: 'Widget',
                        unitPrice: 19.99,
                        quantity: 2,
                        subtotal: 39.98,
                        discount: 0,
                        total: 39.98,
                    }],
                totalQuantity: 2,
                totalPrice: 39.98,
                totalDiscount: 0,
                finalTotal: 39.98,
            };
            const result = formatter.formatOrder(orderCalc);
            (0, vitest_1.expect)(result).toContain('$19.99');
            (0, vitest_1.expect)(result).toContain('$39.98');
        });
        (0, vitest_1.it)('should format currency in de-DE locale with EUR', () => {
            const formatter = new formatter_1.OrderFormatter({ locale: 'de-DE', currency: 'EUR' });
            const orderCalc = {
                products: [{
                        productName: 'Widget',
                        unitPrice: 19.99,
                        quantity: 2,
                        subtotal: 39.98,
                        discount: 0,
                        total: 39.98,
                    }],
                totalQuantity: 2,
                totalPrice: 39.98,
                totalDiscount: 0,
                finalTotal: 39.98,
            };
            const result = formatter.formatOrder(orderCalc);
            // German format uses comma as decimal separator
            (0, vitest_1.expect)(result).toContain('19,99');
            (0, vitest_1.expect)(result).toContain('39,98');
        });
        (0, vitest_1.it)('should format currency in en-GB locale with GBP', () => {
            const formatter = new formatter_1.OrderFormatter({ locale: 'en-GB', currency: 'GBP' });
            const orderCalc = {
                products: [{
                        productName: 'Widget',
                        unitPrice: 19.99,
                        quantity: 2,
                        subtotal: 39.98,
                        discount: 0,
                        total: 39.98,
                    }],
                totalQuantity: 2,
                totalPrice: 39.98,
                totalDiscount: 0,
                finalTotal: 39.98,
            };
            const result = formatter.formatOrder(orderCalc);
            (0, vitest_1.expect)(result).toContain('£19.99');
        });
    });
    (0, vitest_1.describe)('formatOrder', () => {
        (0, vitest_1.it)('should format order with discount correctly', () => {
            const formatter = new formatter_1.OrderFormatter({ locale: 'en-US', currency: 'EUR' });
            const orderCalc = {
                products: [{
                        productName: 'Premium Widget',
                        unitPrice: 100,
                        quantity: 3,
                        subtotal: 300,
                        discount: 60,
                        total: 240,
                    }],
                totalQuantity: 3,
                totalPrice: 300,
                totalDiscount: 60,
                finalTotal: 240,
            };
            const result = formatter.formatOrder(orderCalc);
            (0, vitest_1.expect)(result).toContain('Premium Widget');
            (0, vitest_1.expect)(result).toContain('Discount: €60.00');
            (0, vitest_1.expect)(result).toContain('Total 3 items');
            (0, vitest_1.expect)(result).toContain('Total after discount €240.00');
        });
        (0, vitest_1.it)('should not show discount line when discount is zero', () => {
            const formatter = new formatter_1.OrderFormatter({ locale: 'en-US', currency: 'EUR' });
            const orderCalc = {
                products: [{
                        productName: 'Widget',
                        unitPrice: 10,
                        quantity: 5,
                        subtotal: 50,
                        discount: 0,
                        total: 50,
                    }],
                totalQuantity: 5,
                totalPrice: 50,
                totalDiscount: 0,
                finalTotal: 50,
            };
            const result = formatter.formatOrder(orderCalc);
            (0, vitest_1.expect)(result).not.toContain('Discount:');
        });
    });
});
