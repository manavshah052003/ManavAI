import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://manavshah.dev'),
  title: {
    default: 'Manav Shah — AI Engineer & Software Builder',
    template: '%s | Manav Shah',
  },
  description:
    'AI Engineer with hands-on experience in LLMs, generative AI, and applied machine learning. Building intelligent software, automation systems, and products that solve real-world problems.',
  keywords: [
    'Manav Shah',
    'AI Engineer',
    'Machine Learning',
    'Software Engineer',
    'LLMs',
    'Generative AI',
    'NLP',
    'Python',
    'Full Stack Developer',
  ],
  authors: [{ name: 'Manav Shah' }],
  creator: 'Manav Shah',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://manavshah.dev',
    siteName: 'Manav Shah',
    title: 'Manav Shah — AI Engineer & Software Builder',
    description:
      'AI Engineer building intelligent software, automation systems, and products that solve real-world problems.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manav Shah — AI Engineer & Software Builder',
    description:
      'AI Engineer building intelligent software, automation systems, and products.',
    creator: '@manavshah',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Anti-flash script: sets theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('manav-portfolio-theme');
                  var resolved = theme || 'light';
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', resolved);
                  document.documentElement.style.colorScheme = resolved;
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
