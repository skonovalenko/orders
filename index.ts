import { displayOrder } from './src/displayOrder';
import { DiscountRule } from './src/types';


export const DEFAULT_DISCOUNT_RULES: DiscountRule[] = [
    { threshold: 200, percentage: 0.2 },  // 20% off for orders >= 200
    { threshold: 100, percentage: 0.1 },  // 10% off for orders >= 100
];

const products = [
    { name: 'Widget A', price: 25, quantity: 2 },
    { name: 'Widget B', price: 60, quantity: 2 },
    { name: 'Widget C', price: 100, quantity: 3 },
];

displayOrder(products, DEFAULT_DISCOUNT_RULES);

