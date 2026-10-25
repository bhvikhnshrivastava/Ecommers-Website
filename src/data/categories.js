export const CATEGORY_ORDER = ['electronics', 'jewellery', 'mens-clothing', 'womens-clothing'];

export const CATEGORY_META = {
  electronics: {
    slug: 'electronics',
    raw: 'electronics',
    label: 'Electronics',
    shortLabel: 'Tech',
    code: 'ELC',
    eyebrow: 'Sound, screens & storage',
    tagline: 'Objects that keep up with you.',
    description:
      'Considered technology for the desk, the commute and the quiet hours in between. Every piece is chosen for how it feels to use, not just how it looks on paper.',
    discountBase: 16,
    features: [
      'Inspected and tested before dispatch',
      '1-year limited warranty included',
      'Secure, recyclable packaging',
      'Works with standard accessories',
    ],
    warranty: '1-year limited warranty',
    shipping: 'Dispatched within 24 hours. Delivered in 3–5 business days.',
    returnPolicy: '7-day returns on unused items in original packaging.',
    care: 'Wipe with a soft, dry cloth. Keep away from moisture and direct heat.',
  },
  jewellery: {
    slug: 'jewellery',
    raw: 'jewelery',
    label: 'Jewellery',
    shortLabel: 'Jewels',
    code: 'JWL',
    eyebrow: 'Pieces that hold light',
    tagline: 'Small objects. Lasting meaning.',
    description:
      'A quiet edit of rings, chains and earrings made to be worn every day. Pieces that catch the light without asking for attention.',
    discountBase: 20,
    features: [
      'Hypoallergenic, skin-friendly finish',
      'Arrives in a signature Ecaspian pouch',
      'Certificate of authenticity included',
      'Hand-finished detailing',
    ],
    warranty: '6-month plating and craftsmanship guarantee',
    shipping: 'Gift-wrapped and dispatched within 24 hours.',
    returnPolicy: '7-day returns on unworn pieces with tags intact.',
    care: 'Store separately in the pouch provided. Avoid perfume, water and harsh cleaners.',
  },
  'mens-clothing': {
    slug: 'mens-clothing',
    raw: "men's clothing",
    label: "Men's Clothing",
    shortLabel: 'Men',
    code: 'MNL',
    eyebrow: 'Quiet essentials',
    tagline: 'The everyday, considered.',
    description:
      'Layers and staples with a little more thought behind them. Clean lines, honest fabrics and a fit that feels like it was made for you.',
    discountBase: 22,
    features: [
      'Premium fabric with a considered finish',
      'True-to-size, comfortable fit',
      'Easy 7-day returns',
      'Wrapped in recyclable packaging',
    ],
    warranty: 'Quality and craftsmanship guarantee',
    shipping: 'Dispatched within 24 hours. Delivered in 3–5 business days.',
    returnPolicy: '7-day returns on unworn items with tags attached.',
    care: 'Machine wash cold, inside out. Line dry in shade. Warm iron if needed.',
  },
  'womens-clothing': {
    slug: 'womens-clothing',
    raw: "women's clothing",
    label: "Women's Clothing",
    shortLabel: 'Women',
    code: 'WMN',
    eyebrow: 'Soft structure',
    tagline: 'Effortless, with intention.',
    description:
      'Pieces that move easily from morning to evening: considered silhouettes, tactile fabrics and colours that stay with you beyond the season.',
    discountBase: 24,
    features: [
      'Premium fabric with a considered finish',
      'True-to-size, comfortable fit',
      'Easy 7-day returns',
      'Wrapped in recyclable packaging',
    ],
    warranty: 'Quality and craftsmanship guarantee',
    shipping: 'Dispatched within 24 hours. Delivered in 3–5 business days.',
    returnPolicy: '7-day returns on unworn items with tags attached.',
    care: 'Machine wash cold, inside out. Line dry in shade. Warm iron if needed.',
  },
};

export const RAW_TO_SLUG = Object.fromEntries(
  Object.values(CATEGORY_META).map((category) => [category.raw, category.slug]),
);

export function getCategoryMeta(slug) {
  return CATEGORY_META[slug] ?? null;
}
