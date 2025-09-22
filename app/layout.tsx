// app/layout.tsx
// This is the root layout file. It wraps around all pages.
// The Navbar and Footer components here will be present on every page.
// =======================================================================
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Robin Chen - Freelance Product Designer',
    template: '%s | Robin Chen',
  },
  description: 'A freelance product designer and UX developer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <div>
          <main className="flex-grow container mx-auto px-4">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}