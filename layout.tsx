import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'A professional and smooth dark themed Next.js app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
