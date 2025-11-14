import './globals.css';

export const metadata = {
  title: 'Customizable Dashboard',
  description: 'A modern customizable dashboard application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}
