import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spiritual Practice OS | Management & Client Intelligence',
  description: 'Operating system for astrologers, pandits, tarot readers, and spiritual mentors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
