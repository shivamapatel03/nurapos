import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nuradesk | Modern Point of Sale System',
  description: 'Nuradesk - Fast, elegant, and minimal Point of Sale system designed for seamless transactions, inventory management, and business intelligence.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
