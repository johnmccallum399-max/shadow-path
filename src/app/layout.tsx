import './globals.css';
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import TimeCaller from '@/components/TimeCaller';

export const metadata: Metadata = {
  title: 'Shadow Path — Iron Core Operations',
  description: 'Autonomous flip system. Iron Core Operations.',
  manifest: '/manifest.json',
  themeColor: '#0a0a0b',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Shadow Path' },
};

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#0a0a0b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-20">
        <header className="sticky top-0 z-30 backdrop-blur bg-[#0a0a0b]/80 border-b border-[#2a2c33]">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#8a8d96]">Iron Core Ops</div>
              <h1 className="text-lg font-bold">🌑 Shadow Path</h1>
            </div>
            <div className="flex items-center gap-2">
              <TimeCaller />
              <Link href="/ref" className="text-xs px-2 py-1 panel-hi">QUICK REF</Link>
            </div>
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-4">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#2a2c33] bg-[#0a0a0b]/95 backdrop-blur">
          <div className="max-w-md mx-auto grid grid-cols-5 text-[10px] uppercase tracking-wider">
            <Link href="/" className="py-3 text-center">Alerts</Link>
            <Link href="/flips" className="py-3 text-center">Flips</Link>
            <Link href="/listing" className="py-3 text-center">List</Link>
            <Link href="/scouts" className="py-3 text-center">Scouts</Link>
            <Link href="/ops" className="py-3 text-center">Ops</Link>
          </div>
        </nav>
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(()=>{}); }`,
          }}
        />
      </body>
    </html>
  );
}
