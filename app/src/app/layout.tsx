import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { VersionInfo } from '@/components/ui/VersionInfo';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GoalTimeMoney",
  description: "May all the dreams come true",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>',
        sizes: 'any'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="overflow-hidden h-full">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
          style={{ overscrollBehavior: 'none' }}
        >
          <div className="flex flex-col h-full">
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
            <footer className="flex justify-center py-2 border-t border-light-blue-500 border-opacity-75 text-xs">
              <VersionInfo />
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}