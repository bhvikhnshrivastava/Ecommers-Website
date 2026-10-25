import { useState } from 'react';
import { FiCheckCircle, FiMapPin, FiTruck } from 'react-icons/fi';
import { getDeliveryEstimate, formatDeliveryDate } from '@/utils/date';
import { readString, STORAGE_KEYS, writeString } from '@/utils/storage';
import { validatePincode } from '@/utils/validators';
import { cn } from '@/utils/cn';

export default function PincodeCheck({ className, compact = false }) {
  const saved = readString(STORAGE_KEYS.pincode, '');
  const [pincode, setPincode] = useState(saved);
  const [error, setError] = useState('');
  const [delivery, setDelivery] = useState(
    saved ? formatDeliveryDate(getDeliveryEstimate(saved)) : '',
  );

  const handleCheck = (event) => {
    event.preventDefault();
    const validation = validatePincode(pincode);
    if (validation) {
      setError(validation);
      setDelivery('');
      return;
    }
    setError('');
    writeString(STORAGE_KEYS.pincode, pincode);
    setDelivery(formatDeliveryDate(getDeliveryEstimate(pincode)));
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-caspian-900/10 bg-white/70 p-3.5',
        compact && 'p-3',
        className,
      )}
    >
      <form onSubmit={handleCheck} className="flex flex-wrap items-center gap-2">
        <FiMapPin className="h-4 w-4 shrink-0 text-caspian-700" aria-hidden="true" />
        <label
          htmlFor="delivery-pincode"
          className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-caspian-900"
        >
          Check delivery
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            id="delivery-pincode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(event) => {
              setPincode(event.target.value.replace(/\D/g, '').slice(0, 6));
              if (error) setError('');
            }}
            placeholder="Enter pincode"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'pincode-error' : 'pincode-result'}
            className="h-9 min-w-0 flex-1 rounded-full border border-caspian-900/15 bg-white px-3 font-sans text-xs text-ink-900 focus:border-caspian-700 focus:outline-none focus:ring-2 focus:ring-champagne-500/20"
          />
          <button
            type="submit"
            className="h-9 shrink-0 rounded-full bg-caspian-900 px-4 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-pearl-50 transition-colors hover:bg-caspian-800"
          >
            Check
          </button>
        </div>
      </form>
      <div aria-live="polite" className="min-h-0">
        {error ? (
          <p
            id="pincode-error"
            role="alert"
            className="mt-2 pl-6 text-[0.68rem] text-terracotta-600"
          >
            {error}
          </p>
        ) : delivery ? (
          <p
            id="pincode-result"
            className="mt-2 flex items-center gap-1.5 pl-6 text-[0.7rem] text-ink-700"
          >
            <FiCheckCircle className="h-3.5 w-3.5 text-caspian-600" />
            Delivery by <strong className="font-semibold text-caspian-900">{delivery}</strong>
          </p>
        ) : (
          <p className="mt-2 flex items-center gap-1.5 pl-6 text-[0.68rem] text-ink-500">
            <FiTruck className="h-3.5 w-3.5" />
            Free delivery over ₹999 · 7-day returns
          </p>
        )}
      </div>
    </div>
  );
}
