import { FiArrowRight, FiMail, FiPhone } from 'react-icons/fi';
import Accordion from '@/components/common/Accordion';
import Reveal from '@/components/common/Reveal';
import { FAQS } from '@/data/faqs';
import { BRAND } from '@/data/constants';

export default function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-t border-caspian-900/8"
    >
      <div className="container-page section-pad">
        <div className="grid gap-9 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">Good to know</p>
            <h2 id="faq-heading" className="section-title mt-3 max-w-sm">
              Questions, answered quietly.
            </h2>
            <p className="body-copy mt-4 max-w-sm">
              Everything you might want to know about delivery, returns and looking after your
              pieces. If it is not here, we are a message away.
            </p>

            <div className="mt-7 rounded-[1.5rem] border border-caspian-900/10 bg-white p-5">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] text-caspian-700">
                Still wondering?
              </p>
              <p className="mt-2 font-display text-xl leading-snug text-caspian-950">
                A real person will write back.
              </p>
              <div className="mt-4 space-y-2.5 text-sm">
                <a
                  href={`mailto:${BRAND.supportEmail}`}
                  className="group flex items-center gap-2.5 text-ink-700 transition-colors hover:text-caspian-950"
                >
                  <FiMail className="h-4 w-4 shrink-0 text-champagne-600" aria-hidden="true" />
                  <span className="underline decoration-caspian-900/15 underline-offset-4 group-hover:decoration-champagne-500">
                    {BRAND.supportEmail}
                  </span>
                </a>
                <a
                  href={`tel:${BRAND.phoneHref}`}
                  className="group flex items-center gap-2.5 text-ink-700 transition-colors hover:text-caspian-950"
                >
                  <FiPhone className="h-4 w-4 shrink-0 text-champagne-600" aria-hidden="true" />
                  <span className="underline decoration-caspian-900/15 underline-offset-4 group-hover:decoration-champagne-500">
                    {BRAND.phone}
                  </span>
                </a>
              </div>
              <p className="mt-4 flex items-center gap-1.5 border-t border-caspian-900/8 pt-3.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
                9am–9pm IST, seven days a week
                <FiArrowRight className="h-3 w-3 text-champagne-600" aria-hidden="true" />
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Accordion items={FAQS} defaultOpenId="delivery" />
            <p className="mt-5 text-[0.68rem] leading-5 text-ink-500">
              This is a demonstration storefront. Payments are simulated and no physical orders are
              dispatched. See our terms for the full picture.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
