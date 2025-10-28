import { Product, DiscountRule, FormatOptions } from './types';
import { OrderCalculator } from './calculator';
import { OrderFormatter } from './formatter';

/**
 * Display order with products, discounts, and totals
 */
export function displayOrder(
    products: Product[],
    discountRules: DiscountRule[] = [],
    formatOptions: FormatOptions = { locale: 'en-US', currency: 'EUR' }
): void {
    const calculator = new OrderCalculator(discountRules);
    const formatter = new OrderFormatter(formatOptions);

    const orderCalculation = calculator.calculateOrder(products);
    const formattedOutput = formatter.formatOrder(orderCalculation);

    console.log(formattedOutput);
}