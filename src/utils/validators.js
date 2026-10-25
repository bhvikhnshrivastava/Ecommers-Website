export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PINCODE_REGEX = /^[1-9]\d{5}$/;
export const UPI_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

export function validateEmail(value) {
  const email = String(value ?? '').trim();
  if (!email) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
  return '';
}

export function validatePassword(value) {
  const password = String(value ?? '');
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Use at least 8 characters.';
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Include at least one letter and one number.';
  }
  return '';
}

export function validateName(value, label = 'Full name') {
  const name = String(value ?? '').trim();
  if (!name) return `${label} is required.`;
  if (name.length < 2) return `${label} is too short.`;
  if (name.length > 80) return `${label} is too long.`;
  return '';
}

export function validatePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return 'Phone number is required.';
  if (digits.length !== 10) return 'Enter a 10-digit mobile number.';
  if (!PHONE_REGEX.test(digits)) return 'Enter a valid Indian mobile number.';
  return '';
}

export function validatePincode(value) {
  const pincode = String(value ?? '').trim();
  if (!pincode) return 'Pincode is required.';
  if (!PINCODE_REGEX.test(pincode)) return 'Enter a valid 6-digit pincode.';
  return '';
}

export function validateAddressLine(value) {
  const address = String(value ?? '').trim();
  if (!address) return 'Address is required.';
  if (address.length < 8) return 'Add a little more detail to your address.';
  if (address.length > 200) return 'Address is too long.';
  return '';
}

export function validateCity(value) {
  const city = String(value ?? '').trim();
  if (!city) return 'City is required.';
  if (city.length < 2) return 'Enter a valid city name.';
  if (city.length > 60) return 'City name is too long.';
  return '';
}

export function validateLoginForm(values) {
  return Object.fromEntries(
    Object.entries({
      email: validateEmail(values?.email),
      password: validatePassword(values?.password),
    }).filter(([, message]) => Boolean(message)),
  );
}

export function formatCardNumber(value) {
  const digits = String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function passesLuhn(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

export function validateCardNumber(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) return 'Card number is required.';
  if (digits.length < 13 || digits.length > 19) return 'Enter a valid card number.';
  if (!passesLuhn(digits)) return 'That card number looks incorrect.';
  return '';
}

export function validateExpiry(value) {
  const expiry = String(value ?? '').trim();
  if (!expiry) return 'Expiry date is required.';
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return 'Enter expiry as MM/YY.';
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const endOfMonth = new Date(year, month, 1);
  if (endOfMonth <= now) return 'This card has expired.';
  const tenYearsAhead = new Date(now.getFullYear() + 10, now.getMonth(), 1);
  if (endOfMonth > tenYearsAhead) return 'Check the expiry year.';
  return '';
}

export function validateCvv(value) {
  const cvv = String(value ?? '').trim();
  if (!cvv) return 'CVV is required.';
  if (!/^\d{3,4}$/.test(cvv)) return 'Enter a 3 or 4-digit CVV.';
  return '';
}

export function validateUpi(value) {
  const upi = String(value ?? '').trim();
  if (!upi) return 'UPI ID is required.';
  if (!UPI_REGEX.test(upi)) return 'Enter a valid UPI ID, such as name@bank.';
  return '';
}

export function validateCheckoutForm(values = {}) {
  const errors = {
    fullName: validateName(values.fullName, 'Full name'),
    email: validateEmail(values.email),
    phone: validatePhone(values.phone),
    address: validateAddressLine(values.address),
    city: validateCity(values.city),
    state: values.state ? '' : 'Select your state.',
    pincode: validatePincode(values.pincode),
    deliveryMethod: ['standard', 'express'].includes(values.deliveryMethod)
      ? ''
      : 'Choose a delivery method.',
    paymentMethod: ['card', 'upi', 'netbanking', 'cod'].includes(values.paymentMethod)
      ? ''
      : 'Choose a payment method.',
  };

  if (values.landmark && String(values.landmark).trim().length > 100) {
    errors.landmark = 'Keep the landmark under 100 characters.';
  }

  if (values.paymentMethod === 'card') {
    errors.cardNumber = validateCardNumber(values.cardNumber);
    errors.cardName = validateName(values.cardName, 'Name on card');
    errors.cardExpiry = validateExpiry(values.cardExpiry);
    errors.cardCvv = validateCvv(values.cardCvv);
  }

  if (values.paymentMethod === 'upi') {
    errors.upiId = validateUpi(values.upiId);
  }

  if (values.paymentMethod === 'netbanking' && !values.bank) {
    errors.bank = 'Select your bank.';
  }

  if (!values.terms) {
    errors.terms = 'Please accept the terms to place your order.';
  }

  return Object.fromEntries(Object.entries(errors).filter(([, message]) => Boolean(message)));
}

export function validateReviewForm(values = {}) {
  const errors = {};
  const rating = Number(values.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.rating = 'Choose a rating from 1 to 5 stars.';
  }
  errors.name = validateName(values.name, 'Your name');
  const title = String(values.title ?? '').trim();
  if (!title) errors.title = 'Add a short headline.';
  else if (title.length < 3) errors.title = 'Headline is too short.';
  else if (title.length > 80) errors.title = 'Keep the headline under 80 characters.';

  const comment = String(values.comment ?? '').trim();
  if (!comment) errors.comment = 'Share a few words about the product.';
  else if (comment.length < 10)
    errors.comment = 'Add a little more detail (at least 10 characters).';
  else if (comment.length > 800) errors.comment = 'Keep your review under 800 characters.';

  return errors;
}

export function validateNewsletter(value) {
  return validateEmail(value);
}
