export const BRAND = {
  name: 'Ecaspian',
  wordmark: 'ECASPIAN',
  tagline: 'Curated for the extraordinary.',
  email: 'hello@ecaspian.com',
  supportEmail: 'support@ecaspian.com',
  phone: '+91 22 4000 1280',
  phoneHref: '+912240001280',
  address: 'The Ecaspian Studio, 14 Rampart Row, Kala Ghoda, Mumbai 400001',
  instagram: 'https://www.instagram.com/',
  facebook: 'https://www.facebook.com/',
  twitter: 'https://x.com/',
};

export const ANNOUNCEMENT = {
  message: 'Complimentary delivery over ₹999',
  secondary: '7-day returns · Secure checkout · Made for India',
};

export const TRUST_FEATURES = [
  {
    id: 'delivery',
    icon: 'truck',
    title: 'Complimentary delivery',
    description: 'On all orders over ₹999, packed and delivered with care.',
  },
  {
    id: 'returns',
    icon: 'returns',
    title: 'Seven-day returns',
    description: 'Changed your mind? Returns should feel uncomplicated.',
  },
  {
    id: 'secure',
    icon: 'shield',
    title: 'Secure checkout',
    description: 'Encrypted payments through trusted Indian partners.',
  },
  {
    id: 'support',
    icon: 'headphones',
    title: 'Here to help',
    description: 'A real person, seven days a week, 9am–9pm IST.',
  },
];

export const NOTIFICATIONS = [
  {
    id: 'n1',
    icon: 'sparkle',
    title: 'The jewellery edit is live',
    body: 'Quiet gold pieces, chosen for everyday.',
    to: '/category/jewellery',
  },
  {
    id: 'n2',
    icon: 'truck',
    title: 'Complimentary delivery',
    body: 'Free delivery on every order above ₹999.',
    to: '/shop',
  },
  {
    id: 'n3',
    icon: 'heart',
    title: 'Your wishlist, waiting',
    body: 'The pieces you saved are ready when you are.',
    to: '/wishlist',
  },
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'discount', label: 'Biggest saving' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const PAYMENT_METHODS = ['VISA', 'Mastercard', 'RuPay', 'UPI', 'Net banking', 'COD'];

export const DELIVERY_METHODS = [
  {
    id: 'standard',
    label: 'Standard delivery',
    description: '3–5 business days',
    fee: 0,
    note: 'Complimentary above ₹999',
  },
  {
    id: 'express',
    label: 'Express delivery',
    description: '1–2 business days',
    fee: 99,
    note: 'Priority dispatch',
  },
];

export const BANK_OPTIONS = [
  'HDFC Bank',
  'ICICI Bank',
  'State Bank of India',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Other bank',
];

export const PAYMENT_OPTIONS = [
  {
    id: 'card',
    label: 'Card',
    description: 'Visa, Mastercard or RuPay',
  },
  {
    id: 'upi',
    label: 'UPI',
    description: 'Google Pay, PhonePe, Paytm and more',
  },
  {
    id: 'netbanking',
    label: 'Net banking',
    description: 'All major Indian banks',
  },
  {
    id: 'cod',
    label: 'Cash on delivery',
    description: 'Pay when your order arrives · ₹49 fee',
  },
];

export const TRENDING_SEARCHES = ['Gold ring', 'Monitor', 'Jacket', 'Backpack'];

export const HERO_SLIDES = [
  {
    id: 'electronics',
    productId: 14,
    eyebrow: 'The screen & sound edit',
    title: 'Technology with a quieter kind of beauty.',
    description:
      'Screens, storage and sound chosen for the way they live in your space — considered, calm and quietly capable.',
    ctaLabel: 'Explore electronics',
    ctaTo: '/category/electronics',
    footnote: 'Up to 24% off this week',
  },
  {
    id: 'jewellery',
    productId: 6,
    eyebrow: 'Pieces that hold light',
    title: 'A little gold. A lasting kind of joy.',
    description:
      'An intimate edit of rings and chains made to be worn every day, and kept for years. Gift-wrapped, always.',
    ctaLabel: 'Discover jewellery',
    ctaTo: '/category/jewellery',
    footnote: 'Signature gift wrapping included',
  },
  {
    id: 'womens-clothing',
    productId: 19,
    eyebrow: 'The new wardrobe',
    title: 'Softly structured. Effortlessly you.',
    description:
      'Tactile layers and easy silhouettes in a palette that works harder. Made for real days, not just photographs.',
    ctaLabel: 'Shop womenswear',
    ctaTo: '/category/womens-clothing',
    footnote: 'New-season pieces, thoughtfully chosen',
  },
  {
    id: 'mens-clothing',
    productId: 3,
    eyebrow: 'Quiet essentials',
    title: 'Considered layers for every day.',
    description:
      'Honest fabrics, clean lines and fits that feel familiar from the first wear. The kind of pieces you reach for without thinking.',
    ctaLabel: 'Shop menswear',
    ctaTo: '/category/mens-clothing',
    footnote: 'Free returns within seven days',
  },
];

export const EDITOR_PRODUCT_IDS = [6, 14, 3, 19, 8, 10, 2, 15];
export const PROMO_PRODUCT_ID = 7;

export const FREE_DELIVERY_THRESHOLD = 999;
export const STANDARD_DELIVERY_FEE = 79;
export const EXPRESS_DELIVERY_FEE = 99;
export const COD_FEE = 49;
