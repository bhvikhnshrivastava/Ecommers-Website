import { useId, useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { cn } from '@/utils/cn';

export default function Accordion({ items = [], defaultOpenId = null, className }) {
  const [openId, setOpenId] = useState(defaultOpenId);
  const prefix = useId();

  return (
    <div className={cn('divide-y divide-caspian-900/10 border-y border-caspian-900/10', className)}>
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `${prefix}-trigger-${item.id}`;
        const panelId = `${prefix}-panel-${item.id}`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span
                  className={cn(
                    'font-sans text-sm font-semibold transition-colors sm:text-[0.95rem]',
                    open ? 'text-caspian-900' : 'text-ink-900 group-hover:text-caspian-900',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                    open
                      ? 'rotate-180 border-caspian-900 bg-caspian-900 text-pearl-50'
                      : 'border-caspian-900/20 text-caspian-900 group-hover:border-caspian-900/40',
                  )}
                >
                  {open ? <FiMinus className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!open}
              className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
              style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <div className="pb-6 pr-12 font-sans text-sm leading-7 text-ink-500">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
