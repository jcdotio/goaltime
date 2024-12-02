"use client"

import GoalTreeNodeView from '@/components/goaltree/GoalTreeNodeView';
import { Home as HomeIcon, Settings, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';  

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b flex-shrink-0">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Goal Tree</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <HomeIcon className="w-4 h-4" />
                  <span className="text-sm">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <HelpCircle className="w-4 h-4" />
                  <span className="text-sm">Help</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <div className="space-y-1.5">
                <div className="w-6 h-0.5 bg-current"></div>
                <div className="w-6 h-0.5 bg-current"></div>
                <div className="w-6 h-0.5 bg-current"></div>
              </div>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t">
            <ul className="py-2">
              <li>
                <Link href="/" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50">
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1 container mx-auto p-4">
        <GoalTreeNodeView />
      </main>
    </div>
  );
}