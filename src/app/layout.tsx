import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asg by prateek',
  description: 'test',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
