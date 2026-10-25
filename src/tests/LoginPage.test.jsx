import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import { renderWithProviders } from './fixtures';

function renderLogin(store) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<div>Home target</div>} />
    </Routes>,
    { route: '/login', store },
  );
}

describe('LoginPage', () => {
  it('shows validation messages and stays on the page when submitted empty', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(screen.queryByText('Home target')).not.toBeInTheDocument();
  });

  it('fills the demo credentials and signs in successfully', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /use demo/i }));

    expect(screen.getByLabelText(/email address/i)).toHaveValue('demo@ecaspian.com');
    expect(screen.getByLabelText(/^password/i)).toHaveValue('Ecaspian@123');

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Home target', {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('shows the API error for credentials that do not match', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /use demo/i }));
    const password = screen.getByLabelText(/^password/i);
    await user.clear(password);
    await user.type(password, 'WrongPass1');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(
      await screen.findByText(/do not match our demo account/i, {}, { timeout: 4000 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Home target')).not.toBeInTheDocument();
  });
});
