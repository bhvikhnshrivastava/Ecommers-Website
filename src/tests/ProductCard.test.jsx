import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import ProductCard from '@/components/product/ProductCard';
import { formatINR } from '@/utils/currency';
import { makeStore, PRODUCTS, renderWithProviders } from './fixtures';

describe('ProductCard', () => {
  it('shows the name, discounted price, original price and rating', () => {
    renderWithProviders(<ProductCard product={PRODUCTS[0]} />);

    expect(screen.getByRole('heading', { name: 'Aurora Wireless Headphones' })).toBeInTheDocument();
    expect(screen.getByText(formatINR(2499))).toBeInTheDocument();
    expect(screen.getByText(formatINR(3299))).toBeInTheDocument();
    expect(screen.getByText('24%', { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '4.6 out of 5 stars' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Aurora Wireless Headphones' })).toHaveAttribute(
      'href',
      '/product/1',
    );
  });

  it('adds a product to the cart and switches to the Go to cart action', async () => {
    const user = userEvent.setup();
    const store = makeStore();
    renderWithProviders(<ProductCard product={PRODUCTS[0]} />, { store });

    await user.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].quantity).toBe(1);
    expect(screen.getByRole('link', { name: /go to cart/i })).toHaveAttribute('href', '/cart');
  });

  it('toggles the wishlist heart and its accessible pressed state', async () => {
    const user = userEvent.setup();
    const store = makeStore();
    renderWithProviders(<ProductCard product={PRODUCTS[1]} />, { store });

    const addButton = screen.getByRole('button', {
      name: /add caspian gold signet ring to wishlist/i,
    });
    expect(addButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(addButton);

    const removeButton = screen.getByRole('button', {
      name: /remove caspian gold signet ring from wishlist/i,
    });
    expect(removeButton).toHaveAttribute('aria-pressed', 'true');
    expect(store.getState().wishlist.items).toHaveLength(1);
    expect(store.getState().wishlist.items[0].id).toBe(2);

    await user.click(removeButton);
    expect(store.getState().wishlist.items).toHaveLength(0);
  });
});
