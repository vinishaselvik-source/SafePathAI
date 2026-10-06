import React from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
      
      {/* Backdrop overlay touch dismiss */}
      <div className="flex-1" onClick={onClose} />

      {/* Bottom Pull-up Sheet Container */}
      <div className="glass-nav bg-navy-900 border-t border-white/10 rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Pull handle bar */}
        <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto -mt-1 cursor-grab" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-extrabold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-navy-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>

      </div>
    </div>
  );
};
