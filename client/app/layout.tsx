import './globals.css';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Online Auction System',
  description: 'A platform to host and participate in online auctions',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans">
        {/* Header Section */}
        <header className="bg-blue-600 text-white py-6 shadow-md">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-6">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              {/* Logo Image */}
              <div className="w-16 h-16">
                <img src="/images/logo.png" alt="Auction Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <h1 className="text-3xl font-bold">Online Auction System</h1>
            </div>
            {/* Navigation */}
            <nav className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 text-center sm:text-left">
              <Link href="/" className="text-white hover:text-blue-300 transition-colors duration-200">Home</Link>
              <Link href="/auctions" className="text-white hover:text-blue-300 transition-colors duration-200">Auctions</Link>
              <Link href="/create-auction">Create Auction</Link>
              <Link href="/profile" className="text-white hover:text-blue-300 transition-colors duration-200">Profile</Link>
            </nav>
          </div>
        </header>

        {/* Main Content Section */}
        <main className="main-content container mx-auto my-8 px-4 sm:px-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {children}
          </div>
        </main>

        {/* Footer Section */}
        <footer className="bg-blue-600 text-white py-4 mt-12">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Online Auction System. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
