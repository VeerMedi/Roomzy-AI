import React, { useState } from 'react';
import { DesignResult, RoomData } from '../types';
import BlueprintModal from './BlueprintModal';

interface ResultDashboardProps {
  roomData: RoomData;
  result: DesignResult;
  onReset: () => void;
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ roomData, result, onReset }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isNight, setIsNight] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'vastu'>('products');
  const [showBlueprint, setShowBlueprint] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  const getVastuColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 5) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const shareResult = () => {
    // Just a mock for the main dashboard share
    alert(`Shared! "Check out my new room designed on Roomzy AI for under ${roomData.budget}!"`);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24 relative">
      {/* Blueprint Modal Overlay */}
      {showBlueprint && (
        <BlueprintModal
          roomData={roomData}
          result={result}
          onClose={() => setShowBlueprint(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 px-4 py-3 flex justify-between items-center shadow-sm">
        <button onClick={onReset} className="text-stone-500 hover:text-stone-900 font-medium text-sm flex items-center gap-1">
          ← Start Over
        </button>
        <div className="font-bold text-stone-800">Your Design</div>
        <button onClick={shareResult} className="text-orange-600 font-semibold text-sm flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M15.75 4.5a3 3 0 11.825 2.066l-8.421 4.679a3.002 3.002 0 010 1.51l8.421 4.679a3 3 0 11-.729 1.31l-8.421-4.678a3 3 0 110-4.132l8.421-4.679a3 3 0 01-.096-.755z" clipRule="evenodd" />
          </svg>
          Share
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-4 lg:p-6 grid lg:grid-cols-3 gap-6">
        {/* Left Column: Visuals */}
        <div className="lg:col-span-2 space-y-4">

          {/* Fallback Warning */}
          {result.isFallback && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
              <div className="text-orange-600 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-orange-900">Visual Generation Skipped</h4>
                <p className="text-sm text-orange-800">
                  Our design servers are currently at capacity or your plan quota is exceeded.
                  We've provided the detailed <span className="font-bold">Cost Analysis & Vastu Report</span> below using your original photo.
                </p>
              </div>
            </div>
          )}

          {/* Visualizer Card */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-stone-100 relative group">

            {/* Day/Night Toggle */}
            <div className="absolute top-4 right-4 z-20 bg-black/30 backdrop-blur-md rounded-full p-1 flex">
              <button
                onClick={() => setIsNight(false)}
                className={`p-2 rounded-full transition ${!isNight ? 'bg-white text-orange-500 shadow-sm' : 'text-white/70 hover:text-white'}`}
              >
                ☀️
              </button>
              <button
                onClick={() => setIsNight(true)}
                className={`p-2 rounded-full transition ${isNight ? 'bg-stone-800 text-yellow-400 shadow-sm' : 'text-white/70 hover:text-white'}`}
              >
                🌙
              </button>
            </div>

            <div className="relative w-full aspect-[4/3] select-none">
              {/* After Image (Background) */}
              <div
                className={`absolute inset-0 w-full h-full transition-all duration-700 ${isNight ? 'brightness-50 contrast-125 sepia-[.2]' : ''}`}
                style={{
                  backgroundImage: `url(${result.generatedImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              {/* Night Mode Overlay for Warmth */}
              {isNight && <div className="absolute inset-0 bg-orange-900/20 mix-blend-overlay pointer-events-none"></div>}

              {/* Before Image (Foreground, clipped) - Hide slider if fallback */}
              {!result.isFallback && (
                <div
                  className="absolute inset-0 w-full h-full border-r-2 border-white/50 bg-stone-200"
                  style={{
                    width: `${sliderPos}%`,
                    backgroundImage: `url(${roomData.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`
                  }}
                >
                  <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">Before</div>
                </div>
              )}

              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur">
                {result.isFallback ? 'Original Image' : `After (${roomData.style})`}
              </div>

              {/* Slider Input - Disable if fallback */}
              {!result.isFallback && (
                <>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-10"
                  />

                  {/* Slider Handle Visual */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-stone-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Data & Tabs */}
        <div className="lg:col-span-1 flex flex-col h-full gap-4">

          {/* Tabs */}
          <div className="flex p-1 bg-stone-200 rounded-xl">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${activeTab === 'products' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              Shopping List
            </button>
            <button
              onClick={() => setActiveTab('vastu')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${activeTab === 'vastu' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
            >
              Vastu Report
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-stone-100 p-4 min-h-[400px]">

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-bold text-stone-800">Items Needed</h3>
                  <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-600">Based on {roomData.city} rates</span>
                </div>

                {(result?.products || []).map((prod, idx) => (
                  <div key={idx} className="border border-stone-200 rounded-xl p-4 hover:border-orange-300 transition-all group bg-white shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <a
                          href={prod?.retailLink || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-stone-800 text-lg hover:text-orange-600 transition block leading-tight"
                        >
                          {prod?.name || 'Unidentified Item'}
                        </a>
                      </div>
                      <a
                        href={prod?.retailLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-orange-600 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg hover:bg-orange-700 transition shrink-0 shadow-sm"
                      >
                        Buy Now ↗
                      </a>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                      <div className="bg-stone-50 p-2 rounded-lg border border-stone-100">
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Buy (Retail)</div>
                        <div className="font-bold text-stone-900">₹{(prod?.retailPrice ?? 0).toLocaleString()}</div>
                      </div>

                      {roomData.mode === 'Own' ? (
                        <div className="bg-orange-50 p-2 rounded-lg border border-orange-100 relative overflow-hidden">
                          <div className="text-xs text-orange-800 uppercase tracking-wider">Build (Carpenter)</div>
                          <div className="font-bold text-orange-900">₹{(prod?.carpenterPrice ?? 0).toLocaleString()}</div>
                          <div className="text-[10px] leading-tight text-orange-700 mt-1">{prod?.carpenterNotes || 'Custom build'}</div>
                        </div>
                      ) : (
                        <div className="bg-stone-50 p-2 rounded-lg border border-stone-100 opacity-50">
                          <div className="text-xs text-stone-500 uppercase tracking-wider">Build</div>
                          <div className="text-xs mt-1">N/A for Renters</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'vastu' && (
              <div className="space-y-6">
                <div className="text-center p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="text-4xl font-bold mb-1 text-stone-800">{result?.vastu?.score ?? 0}<span className="text-lg text-stone-400">/10</span></div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getVastuColor(result?.vastu?.score ?? 0)}`}>
                    Vastu Score
                  </div>
                  <p className="text-sm text-stone-600 mt-4 leading-relaxed">"{result?.vastu?.summary || 'No summary available.'}"</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-stone-800 uppercase tracking-wider">Issues & Fixes</h4>
                  {(result?.vastu?.issues || []).map((issue, idx) => (
                    <div key={idx} className="flex gap-3 p-3 rounded-xl border border-stone-100 bg-white shadow-sm">
                      <div className={`w-1 h-full rounded-full shrink-0 ${issue.severity === 'high' ? 'bg-red-500' : issue.severity === 'medium' ? 'bg-orange-400' : 'bg-yellow-400'}`}></div>
                      <div>
                        <div className="font-semibold text-stone-800 text-sm">{issue.item}</div>
                        <div className="text-xs text-red-500 mb-1">{issue.issue}</div>
                        <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded">
                          <span className="font-bold text-stone-700">Fix:</span> {issue.fix}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar for Totals */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-lg z-40 safe-area-bottom">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <div className="text-xs text-stone-500">Estimated Project Cost</div>
            <div className="text-xl font-bold text-stone-900">
              ₹{roomData.mode === 'Own' && result.totalCarpenter < result.totalRetail
                ? result.totalCarpenter.toLocaleString()
                : result.totalRetail.toLocaleString()}
              <span className="text-sm font-normal text-stone-500 ml-1">
                {roomData.mode === 'Own' && result.totalCarpenter < result.totalRetail ? '(Custom Build)' : '(Retail Buy)'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowBlueprint(true)}
            className="bg-stone-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-stone-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Get Blueprint / Links
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDashboard;