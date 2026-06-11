import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description: 'Create and manage custom quizzes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/quizzes">
            Quiz Builder
          </Link>
          <nav className="nav">
            <Link href="/quizzes">Quizzes</Link>
            <Link href="/create">Create</Link>
          </nav>
        </header>
        <main className="shell">{children}</main>
      </body>
    </html>
  );
}
