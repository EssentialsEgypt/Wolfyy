import './globals.css';

export const metadata = {
  title: 'Essentials Egypt Enhanced',
  description: 'Unified social media and business management dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}