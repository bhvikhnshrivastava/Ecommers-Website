import {
  COD_FEE,
  EXPRESS_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
} from '@/data/constants';
import { getCoupon } from '@/data/coupons';

export function computeTotals(items = [], couponCode = null, options = {}) {
  const deliveryMethod = options.deliveryMethod ?? 'standard';
  const paymentMethod = options.paymentMethod ?? 'prepaid';

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
  const mrpTotal = items.reduce(
    (sum, item) => sum + Number(item.originalPrice ?? item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
  const productSavings = Math.max(0, mrpTotal - subtotal);
  const itemCount = items.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);

  const coupon = getCoupon(couponCode);
  const couponEligible = Boolean(coupon) && items.length > 0 && subtotal >= coupon.minSubtotal;
  let couponDiscount = 0;

  if (couponEligible) {
    if (coupon.type === 'percent') {
      couponDiscount = Math.min(
        Math.round((subtotal * coupon.value) / 100),
        coupon.maxDiscount ?? Number.MAX_SAFE_INTEGER,
      );
    } else if (coupon.type === 'fixed') {
      couponDiscount = Math.min(coupon.value, subtotal);
    }
  }

  let deliveryFee = 0;
  if (items.length > 0) {
    if (deliveryMethod === 'express') {
      deliveryFee = EXPRESS_DELIVERY_FEE;
    } else if (couponEligible && coupon.type === 'shipping') {
      deliveryFee = 0;
    } else {
      deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
    }
  }

  const codFee = items.length > 0 && paymentMethod === 'cod' ? COD_FEE : 0;
  const total = Math.max(0, subtotal - couponDiscount) + deliveryFee + codFee;
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return {
    subtotal,
    mrpTotal,
    productSavings,
    coupon,
    couponEligible,
    couponDiscount,
    couponCode: couponEligible ? coupon.code : null,
    deliveryMethod,
    deliveryFee,
    paymentMethod,
    codFee,
    total,
    itemCount,
    totalSavings: productSavings + couponDiscount,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    freeDeliveryRemaining,
    qualifiesForFreeDelivery: items.length > 0 && subtotal >= FREE_DELIVERY_THRESHOLD,
    deliveryLabel:
      items.length === 0
        ? '—'
        : deliveryFee === 0
          ? 'Complimentary'
          : new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(deliveryFee),
  };
}
