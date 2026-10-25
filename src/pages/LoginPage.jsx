import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearAuthError, loginUser } from '@/redux/authSlice';
import { addToast } from '@/redux/uiSlice';
import { selectAuthError, selectAuthStatus, selectAuthUser } from '@/redux/selectors';
import { DEMO_CREDENTIALS } from '@/api/auth';
import { validateLoginForm } from '@/utils/validators';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { BrandMark } from '@/components/common/BrandLogo';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

const PERKS = [
  'Your bag and wishlist, exactly where you left them.',
  'A faster checkout with your delivery details saved.',
  'Order updates and a seven-day return promise.',
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(selectAuthUser);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from;
  const redirectTo = from
    ? `${from.pathname ?? ''}${from.search ?? ''}${from.hash ?? ''}` || '/'
    : '/';

  useDocumentTitle('Sign in');

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  if (user) return <Navigate to={redirectTo} replace />;

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
    if (error) dispatch(clearAuthError());
  };

  const fillDemo = () => {
    setValues({ email: DEMO_CREDENTIALS.email, password: DEMO_CREDENTIALS.password });
    setErrors({});
    dispatch(clearAuthError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateLoginForm(values);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSubmitting(true);
    try {
      await dispatch(loginUser(values)).unwrap();
      dispatch(
        addToast({
          title: 'Welcome back',
          message: 'Your bag and wishlist are right where you left them.',
        }),
      );
      navigate(redirectTo, { replace: true });
    } catch {
      // The message is shown from the auth slice below the form.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-page py-8 sm:py-12">
      <div className="grid overflow-hidden rounded-[2rem] border border-caspian-900/10 bg-white shadow-soft lg:grid-cols-[1.02fr_0.98fr]">
        <div className="grain relative hidden flex-col justify-between overflow-hidden bg-caspian-950 p-10 text-pearl-50 lg:flex lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-caspian-950 via-caspian-900 to-lagoon-500/50"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full border border-champagne-500/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full border border-pearl-50/10"
          />

          <div className="relative">
            <BrandMark className="h-14 w-14" />
            <p className="eyebrow-light mt-10">The Ecaspian account</p>
            <h1 className="mt-4 max-w-md font-display text-4xl leading-[1.02] text-pearl-50 xl:text-5xl">
              A quieter way to keep the things you love.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-pearl-100/60">
              Sign in to keep your bag, wishlist and delivery details together. No noise, no
              marketing calls, no passwords shared with anyone.
            </p>
          </div>

          <div className="relative mt-10 border-t border-pearl-50/10 pt-7">
            <ul className="space-y-3">
              {PERKS.map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2.5 text-xs leading-6 text-pearl-100/65"
                >
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-champagne-500/15 text-champagne-300">
                    <FiCheck className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <p className="mt-7 font-display text-lg italic text-champagne-300/90">
              “Curated for the extraordinary.”
            </p>
          </div>
        </div>

        <div className="px-6 py-9 sm:px-10 sm:py-12 lg:px-12">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h2 className="mt-2 font-display text-3xl text-caspian-950 sm:text-4xl">
                  Sign in to Ecaspian
                </h2>
              </div>
              <FiLock className="h-6 w-6 text-champagne-500" aria-hidden="true" />
            </div>
            <p className="mt-3 text-xs leading-6 text-ink-500">
              This is a demonstration account experience. Your details stay in this browser.
            </p>

            <div className="mt-6 rounded-xl border border-champagne-500/25 bg-champagne-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-champagne-700">
                    Demo access
                  </p>
                  <p className="mt-1.5 font-sans text-[0.7rem] leading-5 text-ink-700">
                    {DEMO_CREDENTIALS.email}
                    <br />
                    {DEMO_CREDENTIALS.password}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="shrink-0 rounded-full border border-champagne-500/50 bg-white px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.1em] text-champagne-800 transition-colors hover:bg-champagne-100"
                >
                  Use demo
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <Input
                label="Email address"
                id="login-email"
                type="email"
                autoComplete="email"
                icon={FiMail}
                value={values.email}
                onChange={(event) => update('email', event.target.value)}
                error={errors.email}
                placeholder="you@example.com"
                required
              />

              <Input
                label="Password"
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                icon={FiLock}
                value={values.password}
                onChange={(event) => update('password', event.target.value)}
                error={errors.password}
                placeholder="At least 8 characters"
                required
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-caspian-900/6 hover:text-caspian-900"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                }
              />

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-terracotta-500/25 bg-terracotta-100/50 px-3.5 py-2.5 text-xs leading-5 text-terracotta-600"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={submitting || status === 'loading'}
              >
                Sign in
                <FiArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <p className="mt-5 text-center text-[0.66rem] leading-5 text-ink-500">
              New to the store? You can check out this demo with the account above — or{' '}
              <Link
                to="/shop"
                className="font-semibold text-caspian-900 underline decoration-champagne-500 underline-offset-4"
              >
                keep browsing as a guest
              </Link>
              .
            </p>

            <div className="mt-7 border-t border-caspian-900/8 pt-4 text-center">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
                Protected by a very small, very polite demo server
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
