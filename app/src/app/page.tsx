"use client"

import GoalTreeNodeView from '@/components/goaltree/GoalTreeNodeView';
import { Home as HomeIcon, Settings, HelpCircle, X, LogInIcon } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth, SignIn } from "@clerk/nextjs";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { redirect } from "next/navigation";


export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return (
      null
    );
  }

  if (userId) {
    redirect("/dashboard");
  }

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignIn(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b flex-shrink-0">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Goal Time Money</h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-4">
              <li>
                <button 
                  onClick={handleLoginClick}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                >
                  <LogInIcon className="w-4 h-4" />
                  <span className="text-sm">Login</span>
                </button>
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
                <button 
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 w-full text-left"
                >
                  <LogInIcon className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main className="flex-1 container mx-auto p-4">
        Welcome to GTM     
        <iframe width="560" height="315" src="https://www.youtube.com/embed/XD7cPr7TREE?si=R1-1zj5aM4k8WSIC" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </main>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-lg p-4 max-w-md w-full">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <SignIn routing="hash" />
          </div>
        </div>
      )}
    </div>
  );
}