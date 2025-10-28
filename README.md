# Orders Display Project

This project implements an **order display and calculation system** in **TypeScript**, with strict types, configurable discount rules, and proper separation of **calculation logic** from **presentation**.

It demonstrates best practices for:

- Type safety with TypeScript
- Pure calculation functions for testability
- Extensible business rules (discounts, VAT, coupons)
- Proper currency formatting with internationalization support
- Unit testing edge cases and floating point arithmetic using Vitest

---
## Features

- Calculate totals, discounts, and subtotals for a list of products
- Configurable **tiered discount rules** (e.g., 10% for orders ≥ 100€, 20% for orders ≥ 200€)
- Handles floating point prices accurately
- Proper currency formatting with **injectable locale and currency**
- Extensible design for future features like **VAT, coupons, loyalty programs**

---

## ⚙️ Setup

Install dependencies:

```bash
npm install
````

Build the project:

```bash
npm run build
```

Run the app (example):

```bash
npm start
```

Run unit tests:

```bash
npm test
```

Open interactive Vitest UI:

```bash
npm run test:watch
```

---


## Design Note on Extensibility

### Current Architecture Benefits

The refactored solution follows **SOLID principles** and **Separation of Concerns**:

1. **Single Responsibility**: Each class has one clear purpose
    - `OrderCalculator`: Pure business logic
    - `OrderFormatter`: Presentation logic

2. **Open/Closed Principle**: Open for extension, closed for modification
    - Discount rules are configurable via dependency injection
    - No code changes needed to add new discount tiers

3. **Dependency Inversion**: High-level logic doesn't depend on low-level details
    - Format options are injected, not hardcoded

### Future Extensions

**1. VAT/Tax Support**
- Taxes can be layered on top of discounts.
- Rules can define whether tax applies before or after discounts.
- Adding a new tax type doesn’t require touching the order calculation core.

```typescript
interface TaxRule {
  name: string;
  rate: number;
  appliesAfterDiscount: boolean;
}

class OrderCalculator {
  constructor(
    private discountRules: DiscountRule[],
    private taxRules: TaxRule[] = []
  ) {}
  
  calculateOrder(products: Product[]): OrderCalculation {
    // ... existing discount logic
    const tax = this.calculateTax(finalTotal);
    return { ...calculation, tax, grandTotal: finalTotal + tax };
  }
}
```

**2. Coupon System**
- Coupons can be added independently of discount logic.
- Supports both percentage and fixed-value discounts.
- Validation rules (minimum order, maximum discount) are encapsulated in a dedicated service.

```typescript
interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
}

class CouponService {
  applyCoupon(orderTotal: number, coupon: Coupon): number {
    // Coupon validation and calculation logic
  }
}
```

**3. Shipping Costs**
- Shipping calculation is decoupled from order calculation.
- Rules can support free shipping thresholds, per-item costs or flat fees.
- New shipping strategies (express, international) can be added without changing existing code.

```typescript
interface ShippingRule {
  freeShippingThreshold?: number;
  baseCost: number;
  perItemCost?: number;
}

class ShippingCalculator {
  calculateShipping(
    orderTotal: number, 
    itemCount: number, 
    rule: ShippingRule
  ): number {
    if (rule.freeShippingThreshold && orderTotal >= rule.freeShippingThreshold) {
      return 0;
    }
    return rule.baseCost + (rule.perItemCost || 0) * itemCount;
  }
}
```

**4. Complex Discount Logic**
- Using the Strategy Pattern, different discount behaviors can be implemented independently.
- Examples: Tiered discounts, “buy X get Y free”, loyalty discounts, seasonal campaigns.
- The OrderCalculator doesn’t need to know the specifics of each strategy; it simply applies the injected strategy.

```typescript
interface DiscountStrategy {
  calculate(subtotal: number, product: Product): number;
}

class TieredDiscountStrategy implements DiscountStrategy {
  // Current implementation
}

class BuyXGetYStrategy implements DiscountStrategy {
  // Buy 2 get 1 free logic
}

class OrderCalculator {
  constructor(private discountStrategy: DiscountStrategy) {}
}
```

### Key Architectural Decisions

- **Immutability**: All calculations return new objects, no mutation
- **Pure Functions**: Calculator methods have no side effects
- **Testability**: Every component can be tested in isolation
- **Type Safety**: TypeScript ensures compile-time correctness
- **Dependency Injection**: External configuration without code changes
- **Single Source of Truth**: Calculations done once, formatted many ways

This architecture allows the system to grow organically without requiring refactoring of existing code.