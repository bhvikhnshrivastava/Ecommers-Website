import { CATEGORY_META, CATEGORY_ORDER, RAW_TO_SLUG } from '@/data/categories';

const FALLBACK_USD_TO_INR = 84;
const usdToInr = Number(import.meta.env?.VITE_USD_TO_INR) || FALLBACK_USD_TO_INR;

function toSlug(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function defaultMeta(rawCategory) {
  const label = String(rawCategory ?? 'Collection')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    slug: toSlug(rawCategory),
    raw: rawCategory,
    label,
    shortLabel: label,
    code: 'ECP',
    eyebrow: 'The Ecaspian edit',
    tagline: 'Considered pieces, chosen with care.',
    description: 'A small, thoughtful edit from the Ecaspian collection.',
    discountBase: 16,
    features: [
      'Curated by Ecaspian',
      'Inspected before dispatch',
      '7-day returns',
      'Recyclable packaging',
    ],
    warranty: 'Quality guarantee',
    shipping: 'Dispatched within 24 hours. Delivered in 3–5 business days.',
    returnPolicy: '7-day returns on unused items in original packaging.',
    care: 'Handle with care and follow the care label where provided.',
  };
}

export function normalizeProduct(raw) {
  if (!raw || raw.id === undefined || raw.id === null) return null;

  const id = Number(raw.id);
  const rawCategory = raw.category ?? '';
  const slug = RAW_TO_SLUG[rawCategory] ?? toSlug(rawCategory);
  const categoryMeta = CATEGORY_META[slug] ?? defaultMeta(rawCategory);

  const price = Math.max(1, Math.round(Number(raw.price ?? 0) * usdToInr));
  const discountPercent = Math.min(40, categoryMeta.discountBase + (id % 4) * 2);
  const originalPrice = Math.max(
    price + 10,
    Math.ceil(price / (1 - discountPercent / 100) / 10) * 10,
  );
  const discount = Math.max(1, Math.round((1 - price / originalPrice) * 100));
  const stock = 5 + ((id * 7) % 24);
  const rating = Math.round(Number(raw.rating?.rate ?? 0) * 10) / 10;
  const reviewCount = Math.max(0, Number(raw.rating?.count ?? 0));
  const title = String(raw.title ?? 'Untitled piece')
    .replace(/\s+/g, ' ')
    .trim();
  const description = String(raw.description ?? '').trim();

  return {
    id,
    title,
    description,
    price,
    originalPrice,
    discount,
    savings: originalPrice - price,
    category: slug,
    categoryLabel: categoryMeta.label,
    categoryShort: categoryMeta.shortLabel,
    rating,
    reviewCount,
    stock,
    lowStock: stock <= 8,
    sku: `ECP-${categoryMeta.code}-${String(id).padStart(3, '0')}`,
    image: raw.image ?? null,
    images: raw.image ? [raw.image] : [],
    keyFeatures: categoryMeta.features,
    warranty: categoryMeta.warranty,
    shipping: categoryMeta.shipping,
    returnPolicy: categoryMeta.returnPolicy,
    care: categoryMeta.care,
    searchText: `${title} ${categoryMeta.label} ${description}`.toLowerCase(),
  };
}

function buildCategory(rawCategory, products) {
  const slug = RAW_TO_SLUG[rawCategory] ?? toSlug(rawCategory);
  const meta = CATEGORY_META[slug] ?? defaultMeta(rawCategory);
  const items = products.filter((product) => product.category === slug);
  return {
    ...meta,
    count: items.length,
    image: items.find((product) => product.image)?.image ?? null,
  };
}

export function normalizeCatalog({ products = [], categories = [] } = {}) {
  const normalizedProducts = products
    .map(normalizeProduct)
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);

  const rawCategoryList = [
    ...new Set([...categories, ...products.map((product) => product?.category).filter(Boolean)]),
  ];

  const normalizedCategories = rawCategoryList
    .map((category) => buildCategory(category, normalizedProducts))
    .filter((category) => category.count > 0)
    .sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a.slug);
      const bIndex = CATEGORY_ORDER.indexOf(b.slug);
      if (aIndex === -1 && bIndex === -1) return a.label.localeCompare(b.label);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  return {
    products: normalizedProducts,
    categories: normalizedCategories,
  };
}
