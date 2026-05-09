import React, { useState, useRef } from 'react';
import { RoomData, UserMode } from '../types';
import { CITIES, STYLES, BUDGET_RANGES, ORIENTATIONS } from '../constants';

interface InputWizardProps {
  onComplete: (data: RoomData) => void;
}

const InputWizard: React.FC<InputWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RoomData>({
    image: null,
    floorPlan: null,
    city: CITIES[0],
    budget: BUDGET_RANGES[1],
    style: STYLES[0],
    mode: UserMode.RENT,
    orientation: ORIENTATIONS[0]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-stone-800">Show us your space</h2>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-stone-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-50 hover:border-orange-500 transition h-64 bg-white"
      >
        {formData.image ? (
          <img src={formData.image} alt="Preview" className="h-full object-contain rounded-lg" />
        ) : (
          <>
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </div>
            <p className="text-stone-600 font-medium">Click to upload photo</p>
            <p className="text-stone-400 text-sm mt-2">JPG, PNG up to 10MB</p>
          </>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*"
        />
      </div>
      <button 
        disabled={!formData.image}
        onClick={nextStep}
        className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next Step
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-800">The Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">City (for Labor rates)</label>
          <select 
            className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
          >
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Ownership Status</label>
          <div className="grid grid-cols-2 gap-4">
            {[UserMode.RENT, UserMode.OWN].map((mode) => (
              <button
                key={mode}
                onClick={() => setFormData({...formData, mode})}
                className={`p-4 rounded-xl border-2 font-medium transition ${formData.mode === mode ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Budget Range</label>
           <select 
            className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            value={formData.budget}
            onChange={(e) => setFormData({...formData, budget: e.target.value})}
          >
            {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 py-4 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl">Back</button>
        <button onClick={nextStep} className="flex-1 py-4 bg-stone-900 text-white rounded-xl font-bold">Next</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stone-800">Style & Vastu</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Design Style</label>
          <div className="grid grid-cols-2 gap-3">
             {STYLES.map(style => (
               <button
                key={style}
                onClick={() => setFormData({...formData, style})}
                className={`p-3 text-sm rounded-lg border text-left transition ${formData.style === style ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-200 hover:border-stone-400'}`}
               >
                 {style}
               </button>
             ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Room Orientation (for Vastu)</label>
          <select 
            className="w-full p-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            value={formData.orientation}
            onChange={(e) => setFormData({...formData, orientation: e.target.value})}
          >
            {ORIENTATIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <p className="text-xs text-stone-500 mt-1">Point a compass out the main window/door.</p>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 py-4 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl">Back</button>
        <button onClick={() => onComplete(formData)} className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition">
          Generate Magic ✨
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-orange-600' : 'w-2 bg-stone-200'}`} />
          ))}
        </div>
        
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default InputWizard;
