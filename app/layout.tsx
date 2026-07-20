import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// TODO: remplace par ton vrai domaine une fois le DNS confirmé
const siteUrl = 'https://epoxart.store';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Épox'Art | Sols et revêtements époxy",
  description: "Revêtements époxy pour garages, escaliers, sous-sols et espaces commerciaux. Soumission gratuite.",
  openGraph: {
    title: "Épox'Art | Sols et revêtements époxy",
    description: "Revêtements époxy pour garages, escaliers, sous-sols et espaces commerciaux. Soumission gratuite.",
    url: siteUrl,
    siteName: "Épox'Art",
    locale: 'fr_CA',
    type: 'website',
    images: [{ url: '/brand/brand-wide.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Épox'Art | Sols et revêtements époxy",
    description: "Revêtements époxy pour garages, escaliers, sous-sols et espaces commerciaux. Soumission gratuite.",
    images: ['/brand/brand-wide.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
