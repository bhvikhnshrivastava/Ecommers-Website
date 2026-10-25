import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { STORAGE_KEYS } from '@/utils/storage';
import { DEMO_USER, makeCartItem, makeStore, PRODUCTS, renderApp } from './fixtures';

vi.mock('@/utils/date', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, sleep: () => Promise.resolve() };
});

function checkoutStore() {
  return makeStore({
    auth: { user: DEMO_USER },
    cart: { items: [makeCartItem(PRODUCTS[0], 1)], coupon: null },
  });
}

describe('checkout flow', () => {
  it('blocks an incomplete order and explains what is missing', async () => {
    const user = userEvent.setup();
    const store = checkoutStore();
    renderApp({ route: '/checkout', store });

    expect(screen.getByRole('heading', { name: 'Almost home.' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(
      await screen.findByText('Please accept the terms to place your order.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
    expect(screen.getByText('Address is required.')).toBeInTheDocument();
    expect(store.getState().cart.items).toHaveLength(1);
    expect(window.localStorage.getItem(STORAGE_KEYS.orders)).toBeNull();
  });

  it('places a card order, clears the bag and stores a receipt', async () => {
    const user = userEvent.setup();
    const store = checkoutStore();
    renderApp({ route: '/checkout', store });

    await user.type(screen.getByLabelText(/mobile number/i), '9876543210');
    await user.type(screen.getByLabelText(/^address/i), '14 Rampart Row, Kala Ghoda');
    await user.type(screen.getByLabelText(/^city/i), 'Mumbai');
    await user.selectOptions(screen.getByLabelText(/^state/i), 'Maharashtra');
    await user.type(screen.getByLabelText(/^pincode/i), '400001');

    await user.click(screen.getByRole('button', { name: /fill test card/i }));
    await user.click(screen.getByRole('checkbox'));

    await user.click(screen.getByRole('button', { name: /place order/i }));

    expect(
      await screen.findByRole(
        'heading',
        { name: /thank you, aarav/i, level: 1 },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();

    const orders = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.orders));
    expect(orders).toHaveLength(1);
    expect(orders[0]).toMatchObject({
      status: 'confirmed',
      paymentMethod: 'card',
      cardLast4: '1111',
      customer: {
        fullName: 'Aarav Mehta',
        email: 'demo@ecaspian.com',
        phone: '9876543210',
      },
      address: {
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
    });
    expect(orders[0].totals.total).toBe(2499);
    expect(store.getState().cart.items).toHaveLength(0);
    expect(screen.getByText(orders[0].id)).toBeInTheDocument();
  });
});
