"use client"

import { X, LogInIcon, SquareUserIcon, PlayCircle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useAuth, SignIn, SignUp } from "@clerk/nextjs";
import { VideoCard } from '@/components/videocard';

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const { userId, isLoaded } = useAuth();

  const videos = [
    { 
      id: 'XD7cPr7TREE', 
      title: 'The definition and the purpose of the Goal Tree - 2 min. explanation by Bill Dettmer',
      thumbnail: 'https://img.youtube.com/vi/XD7cPr7TREE/maxresdefault.jpg' 
    },
    { 
      id: 't_oM9LvK0rU', 
      title: 'The Goal Movie - How to Version',
      thumbnail: 'https://img.youtube.com/vi/t_oM9LvK0rU/0.jpg' 
    },
    { 
      id: 'jfOkcaQ1TAA', 
      title: '3-Color system for Goal Trees',
      thumbnail: 'https://img.youtube.com/vi/jfOkcaQ1TAA/0.jpg' 
    },
    { 
      id: '_COdSwmIDMY', 
      title: 'How Constraints & Conflicts can Drive Change, Be The Change',
      thumbnail: 'https://img.youtube.com/vi/_COdSwmIDMY/maxresdefault.jpg' 
    },
    { 
      id: 'dVc5xKVwP5I', 
      title: 'How to achieve your goals - Elon Musk',
      thumbnail: 'https://img.youtube.com/vi/dVc5xKVwP5I/0.jpg' 
    },
    { 
      id: 'sLWMhfvQk3M', 
      title:  'The Process of Constant Improvement',
      thumbnail: 'https://img.youtube.com/vi/sLWMhfvQk3M/0.jpg' 
    },
    { 
      id: 'f2obvoMglUE', 
      title: 'Eliyahu Goldratt - Matter of Choice',
      thumbnail: 'https://img.youtube.com/vi/f2obvoMglUE/0.jpg' 
    },



  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === 'true') setShowSignUp(true);
    if (params.get('signin') === 'true') setShowSignIn(true);
  }, []);

  const handleLoginClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignIn(true);
    setIsMobileMenuOpen(false);
  }, []);

  const handleSignupClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowSignUp(true);
    setIsMobileMenuOpen(false);
  }, []);

  if (!isLoaded) return null;
  if (userId) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
          <div className="text-xl font-bold space-y-2">
          <span className="inline-flex items-center">
            <span className="-translate-y-0.5">🎯</span> {/* Adjust the Y translation */}
            <span className="ml-1">GoalTimeMoney</span>
          </span>
         </div>
          </h1>
          
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
              <li>
                <button 
                  onClick={handleSignupClick}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                >
                  <SquareUserIcon className="w-4 h-4" />
                  <span className="text-sm">Sign Up</span>
                </button>
              </li>
            </ul>
          </nav>

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

      {/* Hero Section */}
  <section className="relative min-h-[80vh] md:min-h-[70vh] flex items-center">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
   {/*  <div className="absolute inset-0">
      <img
        src="https://plus.unsplash.com/premium_photo-1682310140123-d479f37e2c88?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="achive your dreams"
        className="w-full h-full object-cover"
      />
    </div>*/}
    <div className="relative container mx-auto px-4 py-20 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Accomplish your Goals.<br />
        Master Your Time.<br />
        Model Revenue & Expenses.

      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl">
        Schedule, plan and colloborate in a new way. Tackle day to day tasks and life long goals at the same time using a proven sought after 
        method updated with the two most precious commodities for every person and organization: Time and Money.
      </p>
      <p className="text-xl md:text-2xl mb-5 max-w-2xl">
        Make your goals a reality with GoalTimeMoney</p>
      <button
        onClick={handleSignupClick}
        className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
      >
        Get Started Free
      </button>
    </div>
  </section>

  {/* Video Grid Section */}
  <section className="container mx-auto px-4 py-16">
    <h2 className="text-2xl md:text-3xl font-bold mb-8">
      Inspirational Videos
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map(video => (
        <VideoCard
          key={video.id}
          {...video}
          onPlay={setActiveVideoId}
        />
      ))}
    </div>
  </section>

  {/* Video Modal */}
  {activeVideoId && (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
      onClick={() => setActiveVideoId(null)}
    >
      <div className="w-full max-w-4xl aspect-video">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )}

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