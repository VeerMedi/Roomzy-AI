import React, { useEffect, useState } from 'react';

const MESSAGES = [
  "Consulting the Vastu Shastri...",
  "Haggling with the virtual carpenter...",
  "Measuring for IKEA furniture...",
  "Applying 'Jugaad' algorithms...",
  "Checking local labor rates in your area...",
  "Polishing the digital marble...",
  "Ensuring good vibes only..."
];

const Processing: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white p-4">
      <div className="w-24 h-24 relative mb-8">
        <div className="absolute inset-0 border-4 border-stone-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🏗️
        </div>
      </div>
      
      <h2 className="text-xl md:text-2xl font-semibold mb-2 text-center animate-pulse">
        {MESSAGES[msgIndex]}
      </h2>
      <p className="text-stone-400 text-sm">This might take about 30 seconds.</p>
    </div>
  );
};

export default Processing;
