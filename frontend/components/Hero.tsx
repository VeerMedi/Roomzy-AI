import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-stone-50">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100 rounded-full blur-3xl opacity-50 translate-y-1/4 -translate-x-1/4"></div>

      <nav className="flex justify-between items-center p-6 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="text-2xl font-bold tracking-tight text-stone-800">Roomzy AI</span>
        </div>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-stone-600 hover:text-orange-600 transition">Login</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 max-w-4xl mx-auto">
        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold tracking-wide uppercase mb-6">
          The "Pinterest Killer" of India
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-stone-900 leading-tight mb-6">
          Stop Pinning.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Start Building.</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mb-10">
          Upload a photo of your room. We give you the design, the Vastu score, and the exact cost to 
          <span className="font-semibold text-stone-800"> Buy vs. Build</span> locally.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-stone-900 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-stone-800 transform hover:-translate-y-1 transition duration-200 flex items-center justify-center gap-2"
          >
            <span>Redesign My Room</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
            <div className="text-2xl mb-2">🇮🇳</div>
            <h3 className="font-bold text-stone-800">Desi Context</h3>
            <p className="text-xs text-stone-500">Designs for Indian apartments & layouts.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
            <div className="text-2xl mb-2">🕉️</div>
            <h3 className="font-bold text-stone-800">Vastu Validated</h3>
            <p className="text-xs text-stone-500">Culturally compliant layouts automatically.</p>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
            <div className="text-2xl mb-2">🔨</div>
            <h3 className="font-bold text-stone-800">Buy vs Build</h3>
            <p className="text-xs text-stone-500">Compare IKEA prices with local carpenter rates.</p>
          </div>
           <div className="p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
            <div className="text-2xl mb-2">🗝️</div>
            <h3 className="font-bold text-stone-800">Renter Mode</h3>
            <p className="text-xs text-stone-500">Designs that ensure you get your deposit back.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
