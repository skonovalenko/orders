import { describe, it, expect } from 'vitest';
import { OrderFormatter } from '../src/formatter';
import { OrderCalculation } from '../src/types';

describe('OrderFormatter', () => {
    describe('formatCurrency with different locales', () => {
        it('should format currency in en-US locale with USD', () => {
            const formatter = new OrderFormatter({ locale: 'en-US', currency: 'USD' });
            const orderCalc: OrderCalculation = {
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

            expect(result).toContain('$19.99');
            expect(result).toContain('$39.98');
        });

        it('should format currency in de-DE locale with EUR', () => {
            const formatter = new OrderFormatter({ locale: 'de-DE', currency: 'EUR' });
            const orderCalc: OrderCalculation = {
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
            expect(result).toContain('19,99');
            expect(result).toContain('39,98');
        });

        it('should format currency in en-GB locale with GBP', () => {
            const formatter = new OrderFormatter({ locale: 'en-GB', currency: 'GBP' });
            const orderCalc: OrderCalculation = {
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

            expect(result).toContain('£19.99');
        });
    });

    describe('formatOrder', () => {
        it('should format order with discount correctly', () => {
            const formatter = new OrderFormatter({ locale: 'en-US', currency: 'EUR' });
            const orderCalc: OrderCalculation = {
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

            expect(result).toContain('Premium Widget');
            expect(result).toContain('Discount: €60.00');
            expect(result).toContain('Total 3 items');
            expect(result).toContain('Total after discount €240.00');
        });

        it('should not show discount line when discount is zero', () => {
            const formatter = new OrderFormatter({ locale: 'en-US', currency: 'EUR' });
            const orderCalc: OrderCalculation = {
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

            expect(result).not.toContain('Discount:');
        });
    });
});