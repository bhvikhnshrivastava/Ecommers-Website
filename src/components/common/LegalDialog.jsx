import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { LEGAL_DOCUMENTS } from '@/data/legal';

export default function LegalDialog({ documentKey, onClose }) {
  const document = documentKey ? LEGAL_DOCUMENTS[documentKey] : null;

  return (
    <Modal
      open={Boolean(document)}
      onClose={onClose}
      title={document?.title}
      description={document ? `Last updated ${document.updated}` : undefined}
      size="lg"
      footer={
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {document ? (
        <div className="space-y-6">
          <p className="text-sm leading-7 text-ink-700">{document.intro}</p>
          {document.sections.map((section) => (
            <section key={section.heading} className="space-y-2">
              <h3 className="font-display text-xl text-caspian-950">{section.heading}</h3>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-sm leading-7 text-ink-500">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      ) : null}
    </Modal>
  );
}
