import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
})

import './globals.css';

export const metadata: Metadata = {
  title: 'Cendon Checker',
  description: 'Check Cendon matches',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-background text-white ${orbitron.className} tracking-widest`}>{children}</body>
    </html>
  );
}
