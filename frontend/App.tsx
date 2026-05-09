import React, { useState } from 'react';
import { AppState, RoomData, DesignResult } from './types';
import { generateDesignAndAnalysis } from './services/geminiService';
import Hero from './components/Hero';
import InputWizard from './components/InputWizard';
import Processing from './components/Processing';
import ResultDashboard from './components/ResultDashboard';

// Fix: Removed conflicting global Window declaration. 
// The 'aistudio' property is already defined in the environment types.

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [result, setResult] = useState<DesignResult | null>(null);

  const handleStart = async () => {
    // Force API Key selection for the paid image generation model
    // Fix: Cast window to any to access aistudio property without type conflict
    const win = window as any;
    if (win.aistudio) {
      const hasKey = await win.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await win.aistudio.openSelectKey();
      }
    }
    setAppState(AppState.INPUT);
  };

  const handleInputComplete = async (data: RoomData) => {
    setRoomData(data);
    setAppState(AppState.PROCESSING);

    try {
      const designResult = await generateDesignAndAnalysis(data);
      setResult(designResult);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Design generation failed:", error);
      alert("Something went wrong with the AI architect. Please try again.");
      setAppState(AppState.INPUT);
    }
  };

  const handleReset = () => {
    setRoomData(null);
    setResult(null);
    setAppState(AppState.LANDING);
  };

  return (
    <div className="font-poppins">
      {appState === AppState.LANDING && <Hero onStart={handleStart} />}
      {appState === AppState.INPUT && <InputWizard onComplete={handleInputComplete} />}
      {appState === AppState.PROCESSING && <Processing />}
      {appState === AppState.RESULTS && roomData && result && (
        <ResultDashboard roomData={roomData} result={result} onReset={handleReset} />
      )}
    </div>
  );
};

export default App;