export const COUPONS = {
  ECASP10: {
    code: 'ECASP10',
    type: 'percent',
    value: 10,
    maxDiscount: 500,
    minSubtotal: 0,
    label: '10% off your order',
    description: '10% off, up to ₹500. No minimum spend.',
  },
  WELCOME200: {
    code: 'WELCOME200',
    type: 'fixed',
    value: 200,
    minSubtotal: 1999,
    label: '₹200 off',
    description: '₹200 off orders of ₹1,999 or more.',
  },
  FREESHIP: {
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    minSubtotal: 0,
    label: 'Complimentary delivery',
    description: 'Free standard delivery on any order.',
  },
};

export const COUPON_LIST = Object.values(COUPONS);

export function getCoupon(code) {
  const normalised = String(code ?? '')
    .trim()
    .toUpperCase();
  return COUPONS[normalised] ?? null;
}

export function validateCoupon(code, subtotal) {
  const trimmed = String(code ?? '').trim();
  if (!trimmed) {
    return { ok: false, message: 'Enter a coupon code to continue.' };
  }

  const coupon = getCoupon(trimmed);
  if (!coupon) {
    return { ok: false, message: 'That code is not recognised. Check the spelling and try again.' };
  }

  if (subtotal < coupon.minSubtotal) {
    return {
      ok: false,
      message: `Add ₹${(coupon.minSubtotal - subtotal).toLocaleString('en-IN')} more to use ${coupon.code}.`,
    };
  }

  return { ok: true, coupon, message: `${coupon.code} applied.` };
}
