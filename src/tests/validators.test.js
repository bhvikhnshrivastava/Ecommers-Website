import { describe, expect, it } from 'vitest';
import {
  formatCardNumber,
  passesLuhn,
  validateCardNumber,
  validateCheckoutForm,
  validateEmail,
  validateLoginForm,
  validatePassword,
  validatePhone,
  validatePincode,
} from '@/utils/validators';

const futureYear = String(new Date().getFullYear() + 4).slice(-2);

const validCheckout = {
  fullName: 'Aarav Mehta',
  email: 'demo@ecaspian.com',
  phone: '9876543210',
  address: '14 Rampart Row, Kala Ghoda',
  landmark: 'Opposite the gallery',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  deliveryMethod: 'standard',
  paymentMethod: 'card',
  cardNumber: '4111 1111 1111 1111',
  cardName: 'Aarav Mehta',
  cardExpiry: `12/${futureYear}`,
  cardCvv: '123',
  bank: '',
  upiId: '',
  terms: true,
};

describe('form validators', () => {
  it('accepts a valid email and rejects missing or malformed values', () => {
    expect(validateEmail('hello@ecaspian.com')).toBe('');
    expect(validateEmail('')).toBe('Email is required.');
    expect(validateEmail('hello@')).toBe('Enter a valid email address.');
  });

  it('requires a password with at least one letter and one number', () => {
    expect(validatePassword('Ecaspian@123')).toBe('');
    expect(validatePassword('short')).toBe('Use at least 8 characters.');
    expect(validatePassword('allletters')).toBe('Include at least one letter and one number.');
  });

  it('returns only the invalid login fields', () => {
    expect(validateLoginForm({ email: 'demo@ecaspian.com', password: 'Ecaspian@123' })).toEqual({});
    expect(validateLoginForm({ email: '', password: '123' })).toEqual({
      email: 'Email is required.',
      password: 'Use at least 8 characters.',
    });
  });

  it('validates Indian mobile numbers and pincodes', () => {
    expect(validatePhone('98765 43210')).toBe('');
    expect(validatePhone('1234567890')).toBe('Enter a valid Indian mobile number.');
    expect(validatePincode('400001')).toBe('');
    expect(validatePincode('012345')).toBe('Enter a valid 6-digit pincode.');
  });

  it('checks card numbers with the Luhn algorithm and formats them', () => {
    expect(passesLuhn('4111111111111111')).toBe(true);
    expect(validateCardNumber('4111 1111 1111 1111')).toBe('');
    expect(validateCardNumber('4111 1111 1111 1112')).toBe('That card number looks incorrect.');
    expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('accepts a complete checkout form and reports missing terms', () => {
    expect(validateCheckoutForm(validCheckout)).toEqual({});
    expect(validateCheckoutForm({ ...validCheckout, terms: false })).toMatchObject({
      terms: 'Please accept the terms to place your order.',
    });
  });

  it('reports the relevant fields for an empty checkout form', () => {
    const errors = validateCheckoutForm({});
    expect(errors).toMatchObject({
      fullName: 'Full name is required.',
      email: 'Email is required.',
      phone: 'Phone number is required.',
      city: 'City is required.',
      state: 'Select your state.',
      pincode: 'Pincode is required.',
      terms: 'Please accept the terms to place your order.',
    });
  });
});
