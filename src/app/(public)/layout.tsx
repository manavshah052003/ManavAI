import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { ChatWidget } from '@/components/public/ChatWidget';
import { CommandPalette } from '@/components/public/CommandPalette';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" style={{ paddingTop: 'var(--nav-height)' }}>
        {children}
      </main>
      <Footer />
      <ChatWidget />
      <CommandPalette />
    </>
  );
}
