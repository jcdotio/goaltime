"use client"

import { X, LogInIcon } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useAuth, SignIn, SignUp } from "@clerk/nextjs";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    // Check URL parameters for signup
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') {
      setShowSignUp(true);
    }
    if (params.get('signin') === 'true') {
      setShowSignIn(true);
    }
  }, []);

  // Use a callback for login click
  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignIn(true);
    setIsMobileMenuOpen(false);
  }, []);

  // Simple loading state
  if (!isLoaded) return null;

  // Client-side navigation
  if (userId) {
    window.location.href = '/dashboard';
    return null;
  }

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
             
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/XD7cPr7TREE?si=R1-1zj5aM4k8WSIC" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerPolicy="strict-origin-when-cross-origin" 
          allowFullScreen
        />
      </main>

{/* Sign In Modal */}
{showSignIn && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="relative bg-transparent rounded-lg p-4 max-w-md w-full">
      <button
        onClick={() => setShowSignIn(false)}
        className="absolute top-2 right-2 text-white hover:text-gray-200 z-50 rounded-full hover:bg-white/10 p-1 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <SignIn 
        routing="hash"
        afterSignInUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </div>
  </div>
)}

{/* Sign Up Modal */}
{showSignUp && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="relative bg-transparent rounded-lg p-4 max-w-md w-full">
      <button
        onClick={() => setShowSignUp(false)}
        className="absolute top-2 right-2 text-white hover:text-gray-200 z-50 rounded-full hover:bg-white/10 p-1 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <SignUp 
        routing="hash"
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  </div>
)}


    </div>
  );
}