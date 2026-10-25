import { describe, expect, it } from 'vitest';
import { computeTotals } from '@/utils/orderTotals';
import { sortProducts } from '@/utils/sort';
import { formatINR } from '@/utils/currency';
import { makeCartItem, PRODUCTS } from './fixtures';

describe('computeTotals', () => {
  it('adds up line items and unlocks complimentary delivery above ₹999', () => {
    const totals = computeTotals([makeCartItem(PRODUCTS[0], 2)]);

    expect(totals.subtotal).toBe(4998);
    expect(totals.itemCount).toBe(2);
    expect(totals.productSavings).toBe(1600);
    expect(totals.deliveryFee).toBe(0);
    expect(totals.qualifiesForFreeDelivery).toBe(true);
    expect(totals.total).toBe(4998);
  });

  it('charges standard delivery below the threshold', () => {
    const totals = computeTotals([makeCartItem(PRODUCTS[1])]);

    expect(totals.subtotal).toBe(899);
    expect(totals.deliveryFee).toBe(79);
    expect(totals.freeDeliveryRemaining).toBe(100);
    expect(totals.total).toBe(978);
  });

  it('caps the ECASP10 percentage discount at ₹500', () => {
    const totals = computeTotals([makeCartItem(PRODUCTS[0], 3)], 'ECASP10');

    expect(totals.subtotal).toBe(7497);
    expect(totals.couponDiscount).toBe(500);
    expect(totals.couponCode).toBe('ECASP10');
    expect(totals.total).toBe(6997);
  });

  it('ignores a coupon whose minimum spend has not been met', () => {
    const totals = computeTotals([makeCartItem(PRODUCTS[1])], 'WELCOME200');

    expect(totals.couponEligible).toBe(false);
    expect(totals.couponDiscount).toBe(0);
    expect(totals.couponCode).toBeNull();
    expect(totals.total).toBe(978);
  });

  it('applies free shipping to standard delivery but not express, and adds COD', () => {
    const standard = computeTotals([makeCartItem(PRODUCTS[1])], 'FREESHIP');
    const expressCod = computeTotals([makeCartItem(PRODUCTS[1])], 'FREESHIP', {
      deliveryMethod: 'express',
      paymentMethod: 'cod',
    });

    expect(standard.deliveryFee).toBe(0);
    expect(standard.total).toBe(899);
    expect(expressCod.deliveryFee).toBe(99);
    expect(expressCod.codFee).toBe(49);
    expect(expressCod.total).toBe(1047);
  });
});

describe('catalogue helpers', () => {
  it('sorts products by price, rating and discount without mutating the source', () => {
    const source = PRODUCTS;
    const cheapest = sortProducts(source, 'price-asc');
    const topRated = sortProducts(source, 'rating');
    const bestDiscount = sortProducts(source, 'discount');

    expect(cheapest.map((product) => product.id)).toEqual([2, 3, 4, 1]);
    expect(topRated[0].id).toBe(1);
    expect(bestDiscount.map((product) => product.id)).toEqual([2, 3, 4, 1]);
    expect(source.map((product) => product.id)).toEqual([1, 2, 3, 4]);
  });

  it('formats prices in Indian rupees', () => {
    expect(formatINR(2499)).toBe('₹2,499');
    expect(formatINR('not-a-number')).toBe('₹0');
  });
});
