import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/header';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Agent Forge',
  description: 'Create and deploy AI agents with ease.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background">
        <Header session={session} />
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
