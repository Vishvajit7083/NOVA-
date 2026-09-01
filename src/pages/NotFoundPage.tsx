import React from 'react';
import { Compass, Home, Layers, ArrowRight } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div id="not-found-page" className="min-h-[70vh] bg-[#FDFBF7] text-[#111111] flex items-center justify-center py-20 px-6">
      <div className="max-w-xl w-full text-center space-y-6 bg-white border border-[#E8E2D9] rounded-3xl p-10 sm:p-14 shadow-sm">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em]">
          <Compass className="w-3.5 h-3.5" />
          <span>Atelier Navigation Error</span>
        </div>

        {/* Big Code & Title */}
        <div className="space-y-2">
          <span className="text-6xl sm:text-7xl font-serif font-bold text-[#111111] tracking-tighter block">
            404
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#111111] uppercase tracking-wider">
            PAGE NOT FOUND
          </h1>
          <div className="w-12 h-0.5 bg-[#9A7B38] mx-auto mt-3" />
        </div>

        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          The requested garment, atelier salon, or capsule collection page could not be located in our haute couture catalog.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-[#9A7B38] text-white text-xs font-semibold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Aurelia</span>
          </button>

          <button
            onClick={() => onNavigate('collections')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#E0D8C8] hover:border-[#9A7B38] text-stone-900 text-xs font-semibold uppercase tracking-widest rounded-full transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
          >
            <Layers className="w-4 h-4 text-[#9A7B38]" />
            <span>Explore Collections</span>
          </button>
        </div>
      </div>
    </div>
  );
};
