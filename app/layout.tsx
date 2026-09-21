import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://epoxart.store'),
  title: { default: "Épox'Art | Sols et revêtements époxy", template: "%s | Épox'Art" },
  description: "Revêtements époxy pour garages, sous-sols, escaliers et espaces commerciaux sur la Rive-Sud de Montréal. Soumission gratuite avec photos en ligne.",
  openGraph: {
    title: "Épox'Art | Sols et revêtements époxy",
    description: "Préparation du béton, revêtements époxy et finitions protectrices. Demandez une soumission gratuite en ligne.",
    url: 'https://epoxart.store',
    siteName: "Épox'Art",
    locale: 'fr_CA',
    type: 'website',
    images: [{ url: '/brand/brand-wide.png', width: 1016, height: 600, alt: "Épox'Art" }],
  },
  icons: { icon: '/brand/logo-square.jpg' },
};

export const viewport: Viewport = { themeColor: '#060708', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr-CA"><body>{children}</body></html>;
}
