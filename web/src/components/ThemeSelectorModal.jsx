import React, { useState } from 'react';
import { THEMES, applyTheme } from '../theme/themes.js';
import { Palette, Check, X, Sparkles, Sun, Moon } from 'lucide-react';

export default function ThemeSelectorModal({ isOpen, onClose, currentThemeId, onThemeSelect }) {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredThemes = THEMES.filter(t => {
    if (activeCategory === 'All') return true;
    return t.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-[#121620] border border-stone-200 dark:border-[#232938] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-[#232938] flex items-center justify-between bg-stone-50/50 dark:bg-slate-900/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-white font-mono">
                Theme Studio (22 Presets)
              </h3>
              <p className="text-xs text-stone-500 dark:text-slate-400">
                Select your preferred color combination theme
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-2 border-b border-stone-200/80 dark:border-[#232938] flex items-center space-x-2 bg-stone-100/50 dark:bg-[#191E2B]/50 text-xs font-mono">
          {['All', 'Light', 'Dark'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-white dark:bg-[#232938] text-stone-900 dark:text-white font-bold shadow-2xs'
                  : 'text-stone-500 dark:text-slate-400 hover:text-stone-800 dark:hover:text-slate-200'
              }`}
            >
              {cat === 'Light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {cat === 'Dark' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              {cat === 'All' && <Sparkles className="w-3.5 h-3.5 text-emerald-500" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredThemes.map(theme => {
            const isSelected = currentThemeId === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => {
                  applyTheme(theme.id);
                  onThemeSelect(theme.id);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-500/5 shadow-xs ring-1 ring-emerald-500/20'
                    : 'border-stone-200/90 dark:border-[#232938] hover:border-stone-400 dark:hover:border-slate-600 bg-stone-50/50 dark:bg-[#191E2B]/40 hover:bg-white dark:hover:bg-[#191E2B]'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded uppercase ${
                      theme.category === 'Dark'
                        ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                        : 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
                    }`}>
                      {theme.category}
                    </span>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white truncate">
                      {theme.name}
                    </h4>
                  </div>

                  {/* Swatch Previews */}
                  <div className="flex items-center space-x-1.5">
                    {theme.preview.map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-stone-300 dark:border-white/20 inline-block shadow-2xs"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  isSelected 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'border-stone-300 dark:border-white/10 group-hover:border-stone-400'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
