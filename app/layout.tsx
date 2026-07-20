import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Épox'Art | Sols et revêtements époxy",
  description: "Revêtements époxy pour garages, escaliers, sous-sols et espaces commerciaux. Soumission gratuite.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
