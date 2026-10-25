import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@/app/store';
import AppRoutes from '@/routes/AppRoutes';

export const DEMO_USER = {
  id: 'demo-user',
  name: 'Aarav Mehta',
  email: 'demo@ecaspian.com',
  initials: 'AM',
};

const DEFAULTS = {
  title: 'Aurora Wireless Headphones',
  description: 'Over-ear headphones with a warm, balanced sound and a quiet champagne-gold finish.',
  price: 2499,
  originalPrice: 3299,
  discount: 24,
  savings: 800,
  category: 'electronics',
  categoryLabel: 'Electronics',
  categoryShort: 'Tech',
  rating: 4.6,
  reviewCount: 220,
  stock: 12,
  lowStock: false,
  sku: 'ECP-ELC-001',
  image: null,
  images: [],
  keyFeatures: ['Tested before dispatch', 'Recyclable packaging'],
  warranty: '1-year limited warranty',
  shipping: 'Dispatched within 24 hours.',
  returnPolicy: '7-day returns.',
  care: 'Wipe with a soft, dry cloth.',
};

export function makeProduct(overrides = {}) {
  const product = { ...DEFAULTS, ...overrides };
  return {
    ...product,
    searchText:
      overrides.searchText ??
      `${product.title} ${product.categoryLabel} ${product.description}`.toLowerCase(),
  };
}

export const PRODUCTS = [
  makeProduct({
    id: 1,
    title: 'Aurora Wireless Headphones',
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    rating: 4.6,
    reviewCount: 220,
  }),
  makeProduct({
    id: 2,
    title: 'Caspian Gold Signet Ring',
    description: 'A hand-finished gold signet ring with a soft, brushed surface.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'jewellery',
    categoryLabel: 'Jewellery',
    categoryShort: 'Jewels',
    rating: 4.2,
    reviewCount: 96,
    stock: 6,
    lowStock: true,
    sku: 'ECP-JWL-002',
  }),
  makeProduct({
    id: 3,
    title: 'Linen Overshirt',
    description: 'A relaxed linen layer for warm afternoons and cool evenings.',
    price: 1499,
    originalPrice: 1999,
    discount: 25,
    category: 'mens-clothing',
    categoryLabel: "Men's Clothing",
    categoryShort: 'Men',
    rating: 3.8,
    reviewCount: 54,
    stock: 10,
    sku: 'ECP-MNL-003',
  }),
  makeProduct({
    id: 4,
    title: 'Silk Wrap Dress',
    description: 'A softly structured silk dress in a deep lagoon shade.',
    price: 1799,
    originalPrice: 2399,
    discount: 25,
    category: 'womens-clothing',
    categoryLabel: "Women's Clothing",
    categoryShort: 'Women',
    rating: 3.1,
    reviewCount: 32,
    stock: 8,
    sku: 'ECP-WMN-004',
  }),
];

export const CATEGORIES = [
  {
    slug: 'electronics',
    label: 'Electronics',
    shortLabel: 'Tech',
    count: 1,
    image: null,
  },
  {
    slug: 'jewellery',
    label: 'Jewellery',
    shortLabel: 'Jewels',
    count: 1,
    image: null,
  },
  {
    slug: 'mens-clothing',
    label: "Men's Clothing",
    shortLabel: 'Men',
    count: 1,
    image: null,
  },
  {
    slug: 'womens-clothing',
    label: "Women's Clothing",
    shortLabel: 'Women',
    count: 1,
    image: null,
  },
];

export function makeCartItem(product = PRODUCTS[0], quantity = 1) {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    image: product.image,
    category: product.category,
    categoryLabel: product.categoryLabel,
    stock: product.stock,
    quantity,
  };
}

export const PRODUCTS_STATE = {
  items: PRODUCTS,
  categories: CATEGORIES,
  status: 'succeeded',
  error: null,
  source: 'test',
  warning: null,
  fetchedAt: null,
};

export function makeStore(overrides = {}) {
  return setupStore({
    products: { ...PRODUCTS_STATE, ...(overrides.products ?? {}) },
    cart: { items: [], coupon: null, ...(overrides.cart ?? {}) },
    wishlist: { items: [], ...(overrides.wishlist ?? {}) },
    auth: { user: null, status: 'idle', error: null, ...(overrides.auth ?? {}) },
    reviews: { byProduct: {}, ...(overrides.reviews ?? {}) },
    ui: { toasts: [], notificationsRead: false, ...(overrides.ui ?? {}) },
  });
}

export function renderWithProviders(ui, { store = makeStore(), route = '/' } = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>,
    ),
  };
}

export function renderApp({ store = makeStore(), route = '/' } = {}) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>,
    ),
  };
}
