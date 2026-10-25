import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from './fixtures';

describe('SearchPage', () => {
  it('finds matching products from the query string', async () => {
    renderApp({ route: '/search?q=signet' });

    expect(
      await screen.findByRole('heading', { name: 'Caspian Gold Signet Ring', level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('1 match found');
    expect(
      screen.queryByRole('heading', { name: 'Aurora Wireless Headphones', level: 3 }),
    ).not.toBeInTheDocument();
  });
});
