import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoadReady India — 3D Driving Simulator & Complete Indian Road Signs',
  description: 'Source-verified Indian road signs library based on IRC:67-2022, MoRTH guidelines, RTO Learner Licence exam tests, and realistic 3D left-hand traffic driving simulation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
