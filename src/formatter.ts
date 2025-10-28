import { OrderCalculation, ProductCalculation, FormatOptions } from './types';

export class OrderFormatter {
    constructor(private formatOptions: FormatOptions) {}

    /**
     * Format currency amount with proper locale and currency symbol
     */
    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat(this.formatOptions.locale, {
            style: 'currency',
            currency: this.formatOptions.currency,
        }).format(amount);
    }

    /**
     * Format a single product line for display
     */
    formatProductLine(calc: ProductCalculation): string {
        const lines: string[] = [];

        lines.push(
            `${calc.productName}: ${this.formatCurrency(calc.unitPrice)} x ${calc.quantity} = ${this.formatCurrency(calc.subtotal)}`
        );

        if (calc.discount > 0) {
            lines.push(`Discount: ${this.formatCurrency(calc.discount)}`);
        }

        lines.push(`Subtotal: ${this.formatCurrency(calc.total)}`);
        lines.push('');

        return lines.join('\n');
    }

    /**
     * Format complete order summary
     */
    formatOrder(orderCalc: OrderCalculation): string {
        const lines: string[] = [];

        // Product lines
        orderCalc.products.forEach(productCalc => {
            lines.push(this.formatProductLine(productCalc));
        });

        // Summary
        lines.push('----------------------------');
        lines.push(`Total ${orderCalc.totalQuantity} items`);
        lines.push(`Total amount ${this.formatCurrency(orderCalc.totalPrice)}`);
        lines.push(`Total discount ${this.formatCurrency(orderCalc.totalDiscount)}`);
        lines.push(`Total after discount ${this.formatCurrency(orderCalc.finalTotal)}`);

        return lines.join('\n');
    }
}