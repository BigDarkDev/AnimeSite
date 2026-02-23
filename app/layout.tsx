import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AnimeSensei - Watch Anime Online',
  description: 'Stream your favorite anime online for free with AnimeSensei',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* AdSense verification tag removed; ads are loaded via AdUnitRaw ad units */}
      </head>
      <body className={inter.className}>
        {/* Ad scripts are injected by AdUnitRaw instances where ads are placed */}
        {children}
      </body>
    </html>
  );
}
