import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheck,
  FiFacebook,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTwitter,
} from 'react-icons/fi';
import BrandLogo from '@/components/common/BrandLogo';
import LegalDialog from '@/components/common/LegalDialog';
import PaymentBadges from '@/components/common/PaymentBadges';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectCategories } from '@/redux/selectors';
import { addToast } from '@/redux/uiSlice';
import { BRAND } from '@/data/constants';
import { readJSON, STORAGE_KEYS, writeJSON } from '@/utils/storage';
import { validateEmail } from '@/utils/validators';

const exploreLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop all', to: '/shop' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Shopping bag', to: '/cart' },
  { label: 'FAQs', to: '/#faq' },
];

export default function Footer() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [legalDocument, setLegalDocument] = useState(null);

  const handleSubscribe = (event) => {
    event.preventDefault();
    const validation = validateEmail(email);
    if (validation) {
      setError(validation);
      setSuccess('');
      return;
    }

    const normalised = email.trim().toLowerCase();
    const existing = readJSON(STORAGE_KEYS.newsletter, []);
    const subscribers = Array.isArray(existing) ? existing : [];

    if (subscribers.includes(normalised)) {
      setError('');
      setSuccess('You are already on the list. We will be in touch soon.');
      return;
    }

    writeJSON(STORAGE_KEYS.newsletter, [...subscribers, normalised]);
    setError('');
    setSuccess('Welcome to the list. A quieter kind of inbox awaits.');
    setEmail('');
    dispatch(
      addToast({
        title: 'You’re on the list',
        message: 'We will write only when there is something truly worth sharing.',
      }),
    );
  };

  return (
    <footer className="relative overflow-hidden bg-caspian-950 text-pearl-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-lagoon-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-champagne-500/8 blur-3xl"
      />

      <div className="container-page relative">
        <div className="grid gap-8 border-b border-pearl-50/10 py-12 sm:py-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow-light">The Ecaspian list</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl leading-[1.05] text-pearl-50 sm:text-4xl">
              Considered things, occasionally in your inbox.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-pearl-100/60">
              New edits, private offers and the occasional beautiful thing. No noise, no daily
              emails.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubscribe} noValidate>
              <label
                htmlFor="newsletter-email"
                className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-pearl-100/60"
              >
                Email address
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={error ? 'true' : undefined}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className="h-12 flex-1 rounded-full border border-pearl-50/20 bg-pearl-50/8 px-5 font-sans text-sm text-pearl-50 placeholder:text-pearl-100/35 focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-500/20"
                />
                <Button type="submit" variant="gold" className="shrink-0">
                  Join the list
                  <FiArrowRight className="h-4 w-4" />
                </Button>
              </div>
              {error ? (
                <p id="newsletter-error" role="alert" className="mt-2 text-xs text-terracotta-200">
                  {error}
                </p>
              ) : success ? (
                <p
                  role="status"
                  className="mt-2 flex items-center gap-1.5 text-xs text-champagne-300"
                >
                  <FiCheck className="h-3.5 w-3.5" />
                  {success}
                </p>
              ) : (
                <p className="mt-2 text-[0.65rem] leading-5 text-pearl-100/40">
                  By subscribing you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => setLegalDocument('privacy')}
                    className="underline decoration-pearl-100/30 underline-offset-2 hover:text-pearl-100"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.7fr_0.7fr_1fr] lg:gap-8">
          <div>
            <BrandLogo tone="light" showTagline />
            <p className="mt-5 max-w-xs text-sm leading-7 text-pearl-100/60">
              A small, considered store for the things that make a day feel better. Curated in
              Mumbai, delivered across India.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { label: 'Instagram', href: BRAND.instagram, Icon: FiInstagram },
                { label: 'Facebook', href: BRAND.facebook, Icon: FiFacebook },
                { label: 'X (Twitter)', href: BRAND.twitter, Icon: FiTwitter },
              ].map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pearl-50/15 text-pearl-100/70 transition-colors hover:border-champagne-400/50 hover:text-champagne-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-champagne-300">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-pearl-100/65 transition-colors hover:text-pearl-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-champagne-300">
              Collections
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-sm text-pearl-100/65 transition-colors hover:text-pearl-50"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-champagne-300">
              Here to help
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-pearl-100/65">
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="flex items-start gap-2.5 transition-colors hover:text-pearl-50"
                >
                  <FiMail className="mt-0.5 h-4 w-4 shrink-0 text-champagne-400/70" />
                  {BRAND.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${BRAND.phoneHref}`}
                  className="flex items-start gap-2.5 transition-colors hover:text-pearl-50"
                >
                  <FiPhone className="mt-0.5 h-4 w-4 shrink-0 text-champagne-400/70" />
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <FiMapPin className="mt-0.5 h-4 w-4 shrink-0 text-champagne-400/70" />
                <span className="leading-6">{BRAND.address}</span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="mb-2 text-[0.56rem] font-bold uppercase tracking-[0.18em] text-pearl-100/40">
                Secure payments
              </p>
              <PaymentBadges tone="dark" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-pearl-50/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.65rem] leading-5 text-pearl-100/45">
            © {new Date().getFullYear()} Ecaspian. A capstone storefront. Prices in INR, inclusive
            of all taxes.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <button
              type="button"
              onClick={() => setLegalDocument('privacy')}
              className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-pearl-100/50 transition-colors hover:text-pearl-50"
            >
              Privacy
            </button>
            <button
              type="button"
              onClick={() => setLegalDocument('terms')}
              className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-pearl-100/50 transition-colors hover:text-pearl-50"
            >
              Terms & conditions
            </button>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-pearl-100/30">
              Designed in Mumbai
            </span>
          </div>
        </div>
      </div>

      <LegalDialog documentKey={legalDocument} onClose={() => setLegalDocument(null)} />
    </footer>
  );
}
