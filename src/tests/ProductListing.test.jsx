import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { fireEvent, screen } from '@testing-library/react';
import ProductListing from '@/components/product/ProductListing';
import { PRODUCTS, renderWithProviders } from './fixtures';

const productHeadings = () =>
  screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent);

describe('ProductListing', () => {
  it('lists every product and sorts by price', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductListing products={PRODUCTS} title="The collection" />);

    expect(screen.getAllByRole('article')).toHaveLength(4);

    await user.selectOptions(screen.getByLabelText('Sort products'), 'price-asc');

    expect(productHeadings()).toEqual([
      'Caspian Gold Signet Ring',
      'Linen Overshirt',
      'Silk Wrap Dress',
      'Aurora Wireless Headphones',
    ]);
  });

  it('filters products by rating and shows the active filter', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductListing products={PRODUCTS} title="The collection" />);

    await user.click(screen.getByLabelText('4 stars & above'));

    expect(screen.getAllByRole('article')).toHaveLength(2);
    expect(productHeadings()).toEqual(['Aurora Wireless Headphones', 'Caspian Gold Signet Ring']);
    expect(screen.getByRole('button', { name: /remove rating filter/i })).toBeInTheDocument();
  });

  it('shows an empty state for an impossible price range and can clear it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductListing products={PRODUCTS} title="The collection" />);

    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '100' } });

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText('No pieces match those filters.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.queryByText('No pieces match those filters.')).not.toBeInTheDocument();
  });
});
