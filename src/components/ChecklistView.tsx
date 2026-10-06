import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { 
  Luggage, 
  CheckSquare, 
  Square, 
  Sparkles, 
  CloudRain, 
  Plus, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ChecklistViewProps {
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({ items, setItems }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemText, setNewItemText] = useState<string>('');

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: `c-custom-${Date.now()}`,
      category: 'essentials',
      text: newItemText.trim(),
      checked: false,
    };
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const handleOptimizeChecklist = () => {
    // Auto-check high priority safety items
    setItems(prev => prev.map(item => ({ ...item, checked: true })));
  };

  const totalCount = items.length;
  const checkedCount = items.filter(i => i.checked).length;
  const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Luggage className="w-7 h-7 text-teal-400" />
            <span>Smart Travel Checklist</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            AI-tailored packing list based on Chennai → Pondicherry monsoon weather and solo road trip parameters.
          </p>
        </div>

        <button
          onClick={handleOptimizeChecklist}
          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-extrabold text-xs rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>Optimize My Checklist</span>
        </button>
      </div>

      {/* Weather Alert Banner */}
      <div className="p-4 glass-card rounded-2xl border border-amber-500/30 bg-amber-950/20 flex items-start gap-3">
        <CloudRain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-300">🌦️ Weather Advisory Integration:</span>
          <p className="text-slate-300 mt-0.5 leading-relaxed">
            Moderate coastal rainfall forecasted between Kovalam and Marakkanam. We recommend carrying a waterproof poncho, umbrella, and sealed phone pouch.
          </p>
        </div>
      </div>

      {/* Packing Progress Bar Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Packing Readiness Progress</span>
          </span>
          <span className="font-mono text-cyan-300 text-sm">
            {checkedCount} / {totalCount} items ({progressPercent}%)
          </span>
        </div>

        <div className="w-full bg-navy-950 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-400 text-right">
          {progressPercent === 100 ? "🎉 Everything packed! You're 100% prepared." : "Complete remaining items to maximize readiness score."}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'essentials', 'weather', 'emergency', 'roadtrip'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-glow-cyan'
                : 'bg-navy-900 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat === 'all' ? 'All Items' : cat}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`glass-panel p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
              item.checked
                ? 'bg-navy-900/50 border-white/5 opacity-75'
                : 'bg-navy-900/90 border-cyan-500/30 hover:border-cyan-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="text-cyan-400 focus:outline-none"
              >
                {item.checked ? (
                  <CheckSquare className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <div>
                <span className={`text-xs font-semibold ${item.checked ? 'line-through text-slate-400' : 'text-white'}`}>
                  {item.text}
                </span>

                {item.recommendedReason && (
                  <div className="text-[10px] text-amber-300/90 mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{item.recommendedReason}</span>
                  </div>
                )}
              </div>
            </div>

            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-navy-950 border border-white/5 text-slate-400">
              {item.category}
            </span>
          </div>
        ))}
      </div>

      {/* Add Custom Item */}
      <form onSubmit={addItem} className="flex gap-2 pt-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add custom packing item..."
          className="flex-1 px-4 py-2.5 bg-navy-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </form>

    </div>
  );
};
