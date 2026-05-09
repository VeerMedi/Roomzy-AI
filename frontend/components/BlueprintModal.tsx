import React, { useState } from 'react';
import { DesignResult, RoomData } from '../types';

interface BlueprintModalProps {
  roomData: RoomData;
  result: DesignResult;
  onClose: () => void;
}

const BlueprintModal: React.FC<BlueprintModalProps> = ({ roomData, result, onClose }) => {
  const [activeTab, setActiveTab] = useState<'shopping' | 'carpenter' | 'share'>('shopping');

  const totalBudget = roomData.mode === 'Own' && result.totalCarpenter < result.totalRetail
    ? result.totalCarpenter
    : result.totalRetail;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">Project Blueprint</h2>
            <p className="text-stone-500 text-sm">Action plan for your {roomData.style} room in {roomData.city}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-stone-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex-1 py-4 text-sm font-semibold transition border-b-2 ${activeTab === 'shopping' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            🛒 Shopping List
          </button>
          {roomData.mode === 'Own' && (
            <button
              onClick={() => setActiveTab('carpenter')}
              className={`flex-1 py-4 text-sm font-semibold transition border-b-2 ${activeTab === 'carpenter' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
            >
              🔨 Carpenter Job Sheet
            </button>
          )}
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-4 text-sm font-semibold transition border-b-2 ${activeTab === 'share' ? 'border-orange-600 text-orange-600 bg-orange-50' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
          >
            📸 Gruha Pravesh (Share)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50">

          {/* Shopping Tab */}
          {activeTab === 'shopping' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-stone-800">Total Retail Cost: ₹{result.totalRetail.toLocaleString()}</div>
                    <div className="text-xs text-stone-500">Estimated market prices</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition">
                  Export PDF
                </button>
              </div>

              <div className="grid gap-4">
                {result.products.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-xl">
                        📦
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-800">{item.name}</h4>
                        <p className="text-sm text-stone-500 max-w-md">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="font-bold text-stone-900">₹{item.retailPrice.toLocaleString()}</div>
                        <div className="text-xs text-stone-400">Retail Est.</div>
                      </div>
                      <a
                        href={item.retailLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-stone-200 hover:border-orange-500 hover:text-orange-600 rounded-lg text-sm font-semibold transition"
                      >
                        Buy Online
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carpenter Tab */}
          {activeTab === 'carpenter' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-orange-50 p-4 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.703.127 1.5.876 2.183 2.62 1.503 4.192a3.18 3.18 0 01-.486.726l-1.055 1.055a8.216 8.216 0 01-1.034.939" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-stone-800">Total Build Cost: ₹{result.totalCarpenter.toLocaleString()}</div>
                    <div className="text-xs text-stone-500">Materials + Labor ({roomData.city} Rates)</div>
                  </div>
                </div>
                <button onClick={handlePrint} className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-sm font-bold rounded-lg transition flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008h-.008V10.5zm-3 0h.008v.008h-.008V10.5z" />
                  </svg>
                  Print Job Sheet
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Tech Specs / Materials</th>
                      <th className="p-4 text-right">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {result.products.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="p-4 font-medium text-stone-800">{item.name}</td>
                        <td className="p-4 text-stone-600 font-mono text-xs">{item.carpenterNotes}</td>
                        <td className="p-4 text-right font-bold text-stone-800">₹{item.carpenterPrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800 text-sm border border-yellow-200 flex gap-3">
                <span>💡</span>
                <p><strong>Pro Tip:</strong> Show this sheet to at least 3 local carpenters to get the best quote. Prices are based on average material costs in {roomData.city}.</p>
              </div>
            </div>
          )}

          {/* Share Tab */}
          {activeTab === 'share' && (
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="bg-white p-2 rounded-2xl shadow-xl border border-stone-200 transform rotate-1 hover:rotate-0 transition duration-500 max-w-lg w-full">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-900 group">
                  {/* Split View */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="h-1/2 relative">
                      <img src={roomData.image!} className="w-full h-full object-cover opacity-80" alt="Before" />
                      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur">BEFORE</div>
                    </div>
                    <div className="h-1/2 relative">
                      <img src={result.generatedImage} className="w-full h-full object-cover" alt="After" />
                      <div className="absolute bottom-4 left-4 bg-white/90 text-stone-900 text-xs px-2 py-1 rounded shadow">AFTER</div>
                    </div>
                  </div>

                  {/* Overlay Branding */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl text-center border border-white/50">
                      <div className="text-xs text-stone-500 uppercase tracking-widest mb-1">Total Makeover Cost</div>
                      <div className="text-3xl font-bold text-stone-900 mb-1">₹{totalBudget.toLocaleString()}</div>
                      <div className="text-[10px] text-stone-400">Designed on Roomzy AI</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg transition flex items-center gap-2">
                  <span>WhatsApp</span>
                </button>
                <button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold shadow-lg transition flex items-center gap-2">
                  <span>Instagram</span>
                </button>
                <button className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold shadow-lg transition flex items-center gap-2">
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BlueprintModal;