import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for Manav Shah\'s portfolio website.'
};

export default function TermsPage() {
  return (
    <div className="container section page-enter" style={{ maxWidth: '720px' }}>
      <SectionHeader
        label="Legal"
        title="Terms of Use"
        subtitle="Standard terms regarding portfolio content, architecture diagrams, and intellectual property."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
        <section>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            1. Intellectual Property
          </h3>
          <p>
            All case studies, architectural documentation, research excerpts, and custom software designs presented on this site are authored by Manav Shah unless otherwise credited.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
            2. Research Citation
          </h3>
          <p>
            For research papers (including our IEEE publications on EEGNet-BiLSTM and DeepBoost), please cite the respective IEEE Xplore DOI records as indexed in the Achievements section.
          </p>
        </section>
      </div>
    </div>
  );
}
