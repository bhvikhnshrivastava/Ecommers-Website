import { FiHeadphones, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi';
import Reveal from '@/components/common/Reveal';
import { TRUST_FEATURES } from '@/data/constants';

const ICONS = {
  truck: FiTruck,
  returns: FiRefreshCw,
  secure: FiShield,
  support: FiHeadphones,
};

export default function TrustStrip() {
  return (
    <section aria-labelledby="trust-heading" className="border-b border-caspian-900/8 bg-white">
      <div className="container-page py-12 sm:py-14">
        <div className="flex flex-col gap-3 border-b border-caspian-900/8 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">The Ecaspian promise</p>
            <h2
              id="trust-heading"
              className="mt-2 max-w-xl font-display text-2xl leading-tight text-caspian-950 sm:text-3xl"
            >
              What we sell, and how we look after it.
            </h2>
          </div>
          <p className="max-w-sm text-xs leading-6 text-ink-500 sm:text-right">
            Four collections, one standard. Every piece is chosen by hand, checked before it leaves
            us and backed by people who answer their email.
          </p>
        </div>

        <div className="grid gap-x-6 gap-y-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_FEATURES.map((feature, index) => {
            const Icon = ICONS[feature.icon] ?? FiShield;
            return (
              <Reveal key={feature.id} delay={index * 70} className="group">
                <div className="flex items-start gap-3.5">
                  <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-champagne-500/30 bg-champagne-50 text-champagne-700 transition-colors duration-300 group-hover:bg-champagne-100">
                    <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-sans text-[0.82rem] font-semibold text-caspian-950">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-ink-500">{feature.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
