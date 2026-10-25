import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiCreditCard,
  FiGlobe,
  FiInfo,
  FiLock,
  FiPackage,
  FiSmartphone,
  FiUser,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loadCatalog } from '@/redux/productsSlice';
import { clearCart } from '@/redux/cartSlice';
import { addToast } from '@/redux/uiSlice';
import {
  selectAuthUser,
  selectCartCoupon,
  selectCartItems,
  selectCatalogStatus,
} from '@/redux/selectors';
import { computeTotals } from '@/utils/orderTotals';
import { createOrderNumber, getDeliveryEstimate, sleep } from '@/utils/date';
import { formatINR } from '@/utils/currency';
import { formatCardNumber, validateCheckoutForm } from '@/utils/validators';
import { readJSON, readString, STORAGE_KEYS, writeJSON } from '@/utils/storage';
import { BANK_OPTIONS, DELIVERY_METHODS, INDIAN_STATES, PAYMENT_OPTIONS } from '@/data/constants';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Textarea from '@/components/common/Textarea';
import LegalDialog from '@/components/common/LegalDialog';
import CouponForm from '@/components/cart/CouponForm';
import OrderSummary from '@/components/cart/OrderSummary';
import PaymentBadges from '@/components/common/PaymentBadges';
import { cn } from '@/utils/cn';

const PAYMENT_ICONS = {
  card: FiCreditCard,
  upi: FiSmartphone,
  netbanking: FiGlobe,
  cod: FiPackage,
};

const STEPS = ['Bag', 'Details & payment', 'Confirmation'];

function buildInitialValues(user) {
  const saved = readJSON(STORAGE_KEYS.address, {}) || {};
  return {
    fullName: saved.fullName || user?.name || '',
    email: saved.email || user?.email || '',
    phone: saved.phone || '',
    address: saved.address || '',
    landmark: saved.landmark || '',
    city: saved.city || '',
    state: saved.state || '',
    pincode: saved.pincode || readString(STORAGE_KEYS.pincode, ''),
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardName: user?.name || '',
    cardExpiry: '',
    cardCvv: '',
    upiId: '',
    bank: '',
    terms: false,
  };
}

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectAuthUser);
  const items = useAppSelector(selectCartItems);
  const coupon = useAppSelector(selectCartCoupon);
  const status = useAppSelector(selectCatalogStatus);

  const [values, setValues] = useState(() => buildInitialValues(user));
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [legalDocument, setLegalDocument] = useState(null);
  const formRef = useRef(null);

  useDocumentTitle('Checkout');

  useEffect(() => {
    if (status === 'idle') dispatch(loadCatalog());
  }, [dispatch, status]);

  const allErrors = useMemo(() => validateCheckoutForm(values), [values]);
  const visibleErrors = useMemo(() => {
    if (attempted) return allErrors;
    return Object.fromEntries(
      Object.entries(allErrors).filter(([field]) => Boolean(touched[field])),
    );
  }, [allErrors, attempted, touched]);

  const totals = computeTotals(items, coupon, {
    deliveryMethod: values.deliveryMethod,
    paymentMethod: values.paymentMethod === 'cod' ? 'cod' : 'prepaid',
  });

  if (!user) return <Navigate to="/login" replace />;
  if (items.length === 0 && !submitting) return <Navigate to="/cart" replace />;

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const markTouched = (field) => setTouched((current) => ({ ...current, [field]: true }));

  const paymentLabel =
    PAYMENT_OPTIONS.find((option) => option.id === values.paymentMethod)?.label ?? 'Card';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAttempted(true);

    if (Object.keys(allErrors).length > 0) {
      dispatch(
        addToast({
          type: 'error',
          title: 'A few details need a look',
          message: 'Please check the highlighted fields before placing your order.',
        }),
      );
      window.requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"]');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
      });
      return;
    }

    setSubmitting(true);
    await sleep(1100);

    const orderTotals = computeTotals(items, coupon, {
      deliveryMethod: values.deliveryMethod,
      paymentMethod: values.paymentMethod === 'cod' ? 'cod' : 'prepaid',
    });
    const deliveryOption = DELIVERY_METHODS.find((option) => option.id === values.deliveryMethod);
    const eta = getDeliveryEstimate(values.pincode, values.deliveryMethod);
    const order = {
      id: createOrderNumber(),
      placedAt: new Date().toISOString(),
      status: 'confirmed',
      userId: user.id,
      customer: {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/\D/g, ''),
      },
      address: {
        address: values.address.trim(),
        landmark: values.landmark.trim(),
        city: values.city.trim(),
        state: values.state,
        pincode: values.pincode.trim(),
      },
      items: items.map((item) => ({ ...item })),
      totals: orderTotals,
      couponCode: orderTotals.couponCode,
      deliveryMethod: values.deliveryMethod,
      deliveryLabel: deliveryOption?.label ?? 'Standard delivery',
      paymentMethod: values.paymentMethod,
      paymentLabel,
      cardLast4:
        values.paymentMethod === 'card' ? values.cardNumber.replace(/\D/g, '').slice(-4) : null,
      upiMasked:
        values.paymentMethod === 'upi' ? values.upiId.replace(/(.{2}).+(@.+)/, '$1•••$2') : null,
      eta: eta.toISOString(),
    };

    const existing = readJSON(STORAGE_KEYS.orders, []);
    const orders = Array.isArray(existing) ? existing : [];
    writeJSON(STORAGE_KEYS.orders, [order, ...orders].slice(0, 25));
    writeJSON(STORAGE_KEYS.address, {
      fullName: order.customer.fullName,
      email: order.customer.email,
      phone: order.customer.phone,
      ...order.address,
    });

    dispatch(clearCart());
    dispatch(
      addToast({
        title: 'Order confirmed',
        message: `Thank you, ${order.customer.fullName.split(' ')[0]}. Your confirmation is ready.`,
      }),
    );
    navigate(`/order-success/${order.id}`, { replace: true, state: { order } });
  };

  const fillTestCard = () => {
    update('cardNumber', '4111 1111 1111 1111');
    update('cardName', values.fullName || user.name);
    update('cardExpiry', '12/30');
    update('cardCvv', '123');
  };

  return (
    <>
      <div className="border-b border-caspian-900/8 bg-pearl-200/40">
        <div className="container-page py-4">
          <Breadcrumbs items={[{ label: 'Bag', to: '/cart' }, { label: 'Checkout' }]} />
        </div>
      </div>

      <section className="container-page py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The final step</p>
            <h1 className="mt-2 font-display text-4xl text-caspian-950 sm:text-5xl">
              Almost home.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-ink-500">
              Add your details and choose how you would like to pay. This is a demonstration — no
              real payment is taken.
            </p>
          </div>
          <Link to="/cart" className="link-underline">
            <FiArrowLeft className="h-3.5 w-3.5" />
            Back to bag
          </Link>
        </div>

        <ol className="mt-7 flex items-center gap-2 border-y border-caspian-900/10 py-3 text-[0.6rem] font-bold uppercase tracking-[0.12em] sm:gap-4">
          {STEPS.map((step, index) => {
            const active = index === 1;
            const done = index === 0;
            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[0.55rem]',
                    active && 'bg-caspian-900 text-pearl-50',
                    done && 'bg-champagne-100 text-champagne-700',
                    !active && !done && 'border border-caspian-900/15 text-ink-500',
                  )}
                >
                  {done ? <FiCheck className="h-3 w-3" aria-hidden="true" /> : index + 1}
                </span>
                <span className={active ? 'text-caspian-950' : 'text-ink-500'}>{step}</span>
                {index < STEPS.length - 1 ? (
                  <span
                    className="ml-1 hidden h-px w-8 bg-caspian-900/15 sm:block"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-9">
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
            <section
              aria-labelledby="contact-heading"
              className="rounded-[1.5rem] border border-caspian-900/8 bg-white p-4 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-champagne-700">
                    01
                  </p>
                  <h2 id="contact-heading" className="mt-1 font-display text-2xl text-caspian-950">
                    Contact details
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-caspian-100/70 px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.08em] text-caspian-800">
                  <FiUser className="h-3 w-3" aria-hidden="true" />
                  {user.name}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Input
                  id="checkout-full-name"
                  name="fullName"
                  label="Full name"
                  required
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(event) => update('fullName', event.target.value)}
                  onBlur={() => markTouched('fullName')}
                  error={visibleErrors.fullName}
                  maxLength={80}
                />
                <Input
                  id="checkout-email"
                  name="email"
                  label="Email address"
                  type="email"
                  required
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => update('email', event.target.value)}
                  onBlur={() => markTouched('email')}
                  error={visibleErrors.email}
                />
                <Input
                  id="checkout-phone"
                  name="phone"
                  label="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  required
                  autoComplete="tel-national"
                  hint="10 digits, no country code needed."
                  value={values.phone}
                  onChange={(event) =>
                    update('phone', event.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  onBlur={() => markTouched('phone')}
                  error={visibleErrors.phone}
                  containerClassName="sm:col-span-2 sm:max-w-xs"
                />
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-lg bg-pearl-200/60 px-3 py-2.5 text-[0.65rem] leading-5 text-ink-500">
                <FiInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                We use these only to confirm your demo order. Nothing is shared or sold.
              </p>
            </section>

            <section
              aria-labelledby="address-heading"
              className="rounded-[1.5rem] border border-caspian-900/8 bg-white p-4 sm:p-6"
            >
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-champagne-700">
                02
              </p>
              <h2 id="address-heading" className="mt-1 font-display text-2xl text-caspian-950">
                Delivery address
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Textarea
                  id="checkout-address"
                  name="address"
                  label="Address"
                  required
                  rows={3}
                  autoComplete="street-address"
                  placeholder="Flat, building, street"
                  value={values.address}
                  onChange={(event) => update('address', event.target.value)}
                  onBlur={() => markTouched('address')}
                  error={visibleErrors.address}
                  maxLength={200}
                  containerClassName="sm:col-span-2"
                  hint={`${values.address.length}/200 characters`}
                />
                <Input
                  id="checkout-landmark"
                  name="landmark"
                  label="Landmark"
                  autoComplete="address-line2"
                  placeholder="Near, opposite, beside…"
                  value={values.landmark}
                  onChange={(event) => update('landmark', event.target.value)}
                  onBlur={() => markTouched('landmark')}
                  error={visibleErrors.landmark}
                  maxLength={100}
                />
                <Input
                  id="checkout-city"
                  name="city"
                  label="City"
                  required
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={(event) => update('city', event.target.value)}
                  onBlur={() => markTouched('city')}
                  error={visibleErrors.city}
                  maxLength={60}
                />
                <Select
                  id="checkout-state"
                  name="state"
                  label="State"
                  required
                  autoComplete="address-level1"
                  value={values.state}
                  onChange={(event) => update('state', event.target.value)}
                  onBlur={() => markTouched('state')}
                  error={visibleErrors.state}
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Select>
                <Input
                  id="checkout-pincode"
                  name="pincode"
                  label="Pincode"
                  required
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={values.pincode}
                  onChange={(event) =>
                    update('pincode', event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  onBlur={() => markTouched('pincode')}
                  error={visibleErrors.pincode}
                />
              </div>

              <fieldset className="mt-6 border-t border-caspian-900/10 pt-5">
                <legend className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-caspian-900">
                  Delivery method
                </legend>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {DELIVERY_METHODS.map((option) => {
                    const checked = values.deliveryMethod === option.id;
                    const fee =
                      option.id === 'express'
                        ? option.fee
                        : totals.qualifiesForFreeDelivery
                          ? 0
                          : 79;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors',
                          checked
                            ? 'border-caspian-900 bg-pearl-100'
                            : 'border-caspian-900/12 hover:border-caspian-900/30',
                        )}
                      >
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={option.id}
                          checked={checked}
                          onChange={() => update('deliveryMethod', option.id)}
                          className="mt-0.5 h-3.5 w-3.5 accent-champagne-500"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-caspian-950">
                              {option.label}
                            </span>
                            <span className="text-[0.62rem] font-semibold tabular-nums text-caspian-800">
                              {fee === 0 ? 'Free' : formatINR(fee)}
                            </span>
                          </span>
                          <span className="mt-0.5 block text-[0.63rem] leading-5 text-ink-500">
                            {option.description} · {option.note}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                {visibleErrors.deliveryMethod ? (
                  <p role="alert" className="mt-1.5 text-xs text-terracotta-600">
                    {visibleErrors.deliveryMethod}
                  </p>
                ) : null}
              </fieldset>
            </section>

            <section
              aria-labelledby="payment-heading"
              className="rounded-[1.5rem] border border-caspian-900/8 bg-white p-4 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-champagne-700">
                    03
                  </p>
                  <h2 id="payment-heading" className="mt-1 font-display text-2xl text-caspian-950">
                    Payment
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne-100 px-2.5 py-1 text-[0.54rem] font-bold uppercase tracking-[0.08em] text-champagne-800">
                  <FiLock className="h-3 w-3" aria-hidden="true" />
                  Simulated
                </span>
              </div>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {PAYMENT_OPTIONS.map((option) => {
                  const Icon = PAYMENT_ICONS[option.id] ?? FiCreditCard;
                  const checked = values.paymentMethod === option.id;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors',
                        checked
                          ? 'border-caspian-900 bg-pearl-100'
                          : 'border-caspian-900/12 hover:border-caspian-900/30',
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.id}
                        checked={checked}
                        onChange={() => update('paymentMethod', option.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          checked
                            ? 'bg-caspian-900 text-pearl-50'
                            : 'bg-pearl-200 text-caspian-700',
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-caspian-950">
                          {option.label}
                        </span>
                        <span className="mt-0.5 block text-[0.62rem] leading-5 text-ink-500">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {values.paymentMethod === 'card' ? (
                <div className="mt-5 rounded-xl border border-caspian-900/8 bg-pearl-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-caspian-900">
                      Card details
                    </p>
                    <button
                      type="button"
                      onClick={fillTestCard}
                      className="text-[0.58rem] font-bold uppercase tracking-[0.08em] text-champagne-700 underline decoration-champagne-500/30 underline-offset-2 hover:text-caspian-900"
                    >
                      Fill test card
                    </button>
                  </div>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <Input
                      id="checkout-card-number"
                      name="cardNumber"
                      label="Card number"
                      required
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="0000 0000 0000 0000"
                      value={values.cardNumber}
                      onChange={(event) =>
                        update('cardNumber', formatCardNumber(event.target.value))
                      }
                      onBlur={() => markTouched('cardNumber')}
                      error={visibleErrors.cardNumber}
                      maxLength={19}
                      containerClassName="sm:col-span-2"
                    />
                    <Input
                      id="checkout-card-name"
                      name="cardName"
                      label="Name on card"
                      required
                      autoComplete="cc-name"
                      value={values.cardName}
                      onChange={(event) => update('cardName', event.target.value)}
                      onBlur={() => markTouched('cardName')}
                      error={visibleErrors.cardName}
                      maxLength={80}
                      containerClassName="sm:col-span-2"
                    />
                    <Input
                      id="checkout-card-expiry"
                      name="cardExpiry"
                      label="Expiry"
                      required
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={values.cardExpiry}
                      onChange={(event) => {
                        const digits = event.target.value.replace(/\D/g, '').slice(0, 4);
                        update(
                          'cardExpiry',
                          digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits,
                        );
                      }}
                      onBlur={() => markTouched('cardExpiry')}
                      error={visibleErrors.cardExpiry}
                      maxLength={5}
                    />
                    <Input
                      id="checkout-card-cvv"
                      name="cardCvv"
                      label="CVV"
                      required
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      type="password"
                      placeholder="3 digits"
                      value={values.cardCvv}
                      onChange={(event) =>
                        update('cardCvv', event.target.value.replace(/\D/g, '').slice(0, 4))
                      }
                      onBlur={() => markTouched('cardCvv')}
                      error={visibleErrors.cardCvv}
                      maxLength={4}
                    />
                  </div>
                  <p className="mt-3 flex items-start gap-2 text-[0.6rem] leading-4 text-ink-500">
                    <FiInfo className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    Test mode only. Use 4111 1111 1111 1111, any future expiry and any 3-digit CVV.
                    Nothing is charged.
                  </p>
                </div>
              ) : null}

              {values.paymentMethod === 'upi' ? (
                <div className="mt-5 rounded-xl border border-caspian-900/8 bg-pearl-50 p-4">
                  <Input
                    id="checkout-upi"
                    name="upiId"
                    label="UPI ID"
                    required
                    autoComplete="off"
                    placeholder="name@bank"
                    value={values.upiId}
                    onChange={(event) => update('upiId', event.target.value)}
                    onBlur={() => markTouched('upiId')}
                    error={visibleErrors.upiId}
                    hint="Demo only — for example, aarav@okhdfcbank."
                  />
                  <button
                    type="button"
                    onClick={() => update('upiId', 'aarav@okhdfcbank')}
                    className="mt-2 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-champagne-700 underline decoration-champagne-500/30 underline-offset-2 hover:text-caspian-900"
                  >
                    Fill test UPI ID
                  </button>
                </div>
              ) : null}

              {values.paymentMethod === 'netbanking' ? (
                <div className="mt-5 rounded-xl border border-caspian-900/8 bg-pearl-50 p-4">
                  <Select
                    id="checkout-bank"
                    name="bank"
                    label="Your bank"
                    required
                    value={values.bank}
                    onChange={(event) => update('bank', event.target.value)}
                    onBlur={() => markTouched('bank')}
                    error={visibleErrors.bank}
                  >
                    <option value="">Select your bank</option>
                    {BANK_OPTIONS.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </Select>
                  <p className="mt-2 text-[0.6rem] leading-4 text-ink-500">
                    You would normally be redirected to your bank. In this demo, the order is
                    confirmed immediately.
                  </p>
                </div>
              ) : null}

              {values.paymentMethod === 'cod' ? (
                <div className="mt-5 rounded-xl border border-champagne-500/25 bg-champagne-50 p-4">
                  <p className="text-[0.68rem] leading-5 text-champagne-800">
                    Pay cash when your order arrives. A ₹49 handling fee is added to your total.
                    Please keep exact change ready if you can.
                  </p>
                </div>
              ) : null}

              <div className="mt-5 border-t border-caspian-900/10 pt-4">
                <div className="flex items-start gap-2.5">
                  <input
                    id="checkout-terms"
                    name="terms"
                    type="checkbox"
                    checked={values.terms}
                    onChange={(event) => update('terms', event.target.checked)}
                    onBlur={() => markTouched('terms')}
                    aria-invalid={visibleErrors.terms ? 'true' : undefined}
                    aria-describedby={visibleErrors.terms ? 'checkout-terms-error' : undefined}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-champagne-500"
                  />
                  <div>
                    <label
                      htmlFor="checkout-terms"
                      className="cursor-pointer text-[0.72rem] leading-5 text-ink-700"
                    >
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setLegalDocument('terms');
                        }}
                        className="font-semibold text-caspian-900 underline decoration-champagne-500/40 underline-offset-2 hover:text-champagne-700"
                      >
                        Terms & Conditions
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          setLegalDocument('privacy');
                        }}
                        className="font-semibold text-caspian-900 underline decoration-champagne-500/40 underline-offset-2 hover:text-champagne-700"
                      >
                        Privacy Policy
                      </button>
                      . I understand this is a demo order.
                    </label>
                    {visibleErrors.terms ? (
                      <p
                        id="checkout-terms-error"
                        role="alert"
                        className="mt-1 text-xs text-terracotta-600"
                      >
                        {visibleErrors.terms}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-col-reverse gap-3 border-t border-caspian-900/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link to="/cart" className="link-underline self-start sm:self-auto">
                <FiArrowLeft className="h-3.5 w-3.5" />
                Back to bag
              </Link>
              <Button type="submit" size="lg" loading={submitting} className="sm:min-w-64">
                {submitting ? 'Placing your order' : `Place order · ${formatINR(totals.total)}`}
                {!submitting ? <FiArrowRight className="h-4 w-4" /> : null}
              </Button>
            </div>
            <p className="text-center text-[0.6rem] leading-4 text-ink-500 sm:text-right">
              By placing this order you agree to our terms. No real payment will be taken.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl border border-caspian-900/8 bg-white/60 px-4 py-3 sm:justify-between">
              <span className="flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
                <FiLock className="h-3 w-3" aria-hidden="true" />
                Secure checkout
              </span>
              <PaymentBadges />
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <CouponForm subtotal={totals.subtotal} />
            <OrderSummary
              items={items}
              couponCode={coupon}
              deliveryMethod={values.deliveryMethod}
              paymentMethod={values.paymentMethod === 'cod' ? 'cod' : 'prepaid'}
              title="Your order"
              footnote={`${items.length} ${items.length === 1 ? 'piece' : 'pieces'} · delivered to ${values.city || 'your address'}.`}
            >
              <div className="rounded-xl bg-pearl-200/60 px-3 py-2.5 text-[0.64rem] leading-5 text-ink-500">
                Paying by <strong className="font-semibold text-caspian-900">{paymentLabel}</strong>
                {values.deliveryMethod === 'express'
                  ? ' · express delivery'
                  : ' · standard delivery'}
              </div>
              <Link
                to="/cart"
                className="block text-center text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-caspian-700 underline decoration-champagne-500/40 underline-offset-4 hover:text-caspian-950"
              >
                Edit your bag
              </Link>
            </OrderSummary>
            <p className="px-2 text-center text-[0.6rem] leading-5 text-ink-500">
              This is a capstone project. Orders are stored only in this browser. Prices are in INR
              and include all taxes.
            </p>
          </aside>
        </div>
      </section>

      <LegalDialog documentKey={legalDocument} onClose={() => setLegalDocument(null)} />
    </>
  );
}
