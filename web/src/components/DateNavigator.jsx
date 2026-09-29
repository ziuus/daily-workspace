import React, { useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Zap } from 'lucide-react';

/**
 * @typedef {Object} DateNavigatorProps
 * @property {number} offset - Current offset in the feed (0 = today's page)
 * @property {number} [pageSize=50] - Page size (items per page)
 * @property {number} totalItems - Total items in DB
 * @property {boolean} isLoading - Whether a fetch is in progress
 * @property {function(number): void} onNavigate - Callback when user navigates to a specific offset
 * @property {function(): void} onGoToday - Callback to go to today (offset 0)
 * @property {boolean} isAtLatest - Whether we're at the latest page (offset 0)
 * @property {boolean} isAtOldest - Whether we're at the oldest page
 * @property {string} [currentViewDate] - Date of the oldest item in current view
 * @property {string} [currentViewNewestDate] - Date of the newest item in current view
 */

const PAGE_SIZE = 50;

export default function DateNavigator({
  offset,
  pageSize = PAGE_SIZE,
  totalItems,
  isLoading,
  onNavigate,
  onGoToday,
  isAtLatest,
  isAtOldest,
  currentViewDate,
  currentViewNewestDate
}) {
  const containerRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const todayBtnRef = useRef(null);

  // Calculate current page number (0-indexed)
  const currentPage = Math.floor(offset / pageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageDisplay = currentPage + 1;

  // Handle case where totalItems not loaded yet
  const isDataReady = totalItems > 0;
  const effectiveIsAtLatest = isDataReady ? isAtLatest : true;
  const effectiveIsAtOldest = isDataReady ? isAtOldest : false;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger when focused on the feed area or navigator
      const activeEl = document.activeElement;
      const isInputFocused = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      if (isInputFocused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (!effectiveIsAtOldest && !isLoading) {
            onNavigate(offset + pageSize);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (!effectiveIsAtLatest && !isLoading) {
            onNavigate(Math.max(0, offset - pageSize));
          }
          break;
        case 'Home':
          e.preventDefault();
          if (!effectiveIsAtLatest && !isLoading) {
            onGoToday();
          }
          break;
        case 'End':
          e.preventDefault();
          if (!effectiveIsAtOldest && !isLoading) {
            const lastPageOffset = (totalPages - 1) * pageSize;
            onNavigate(lastPageOffset);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [offset, pageSize, totalItems, isLoading, effectiveIsAtLatest, effectiveIsAtOldest, onNavigate, onGoToday]);

  // Focus management for keyboard hints
  const focusContainer = useCallback(() => {
    containerRef.current?.focus();
  }, []);

  // Format date for display
  const formatDateRange = useCallback(() => {
    if (currentViewDate && currentViewNewestDate) {
      const oldest = new Date(currentViewDate);
      const newest = new Date(currentViewNewestDate);
      
      // Same day
      if (oldest.toDateString() === newest.toDateString()) {
        return oldest.toLocaleDateString(undefined, { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      // Same month
      if (oldest.getMonth() === newest.getMonth() && oldest.getFullYear() === newest.getFullYear()) {
        return `${oldest.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${newest.getDate()} ${newest.toLocaleDateString(undefined, { month: 'short' })}`;
      }
      
      // Different months
      return `${oldest.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${newest.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    }
    
    // Fallback to page-based calculation
    const now = new Date();
    const pageStart = new Date(now.getTime() - (currentPage * pageSize * 24 * 60 * 60 * 1000));
    const pageEnd = new Date(now.getTime() - ((currentPage - 1) * pageSize * 24 * 60 * 60 * 1000));
    
    if (currentPage === 0) {
      return 'Today';
    }
    
    return pageStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, [currentViewDate, currentViewNewestDate, currentPage, pageSize]);

  // Check if current view is "today"
  const isTodayView = currentPage === 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onFocus={focusContainer}
      className="relative w-full px-2 py-2.5 bg-slate-950/60 border-t border-white/5"
      role="navigation"
      aria-label="Feed date navigation"
      style={{ outline: 'none' }}
    >
      {/* Keyboard hint - visible on focus */}
      <div className="absolute top-1 right-1 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none">
        <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-900 border border-white/10 rounded text-slate-500">
          ← → navigate · Home today · End oldest
        </kbd>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* Previous Day (Older) - Left Arrow */}
        <button
          ref={prevBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            if (!effectiveIsAtOldest && !isLoading) onNavigate(offset + pageSize);
          }}
          disabled={effectiveIsAtOldest || isLoading}
          aria-label="Older entries (←)"
          aria-disabled={effectiveIsAtOldest || isLoading}
          className={`
            relative flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg touch-manipulation shrink-0
            transition-all duration-200 ease-[0.16,1,0.3,1]
            ${effectiveIsAtOldest || isLoading
              ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-900 border border-white/5'
              : 'text-slate-300 bg-slate-900 border border-white/10 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800/50 active:scale-95'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50
          `}
        >
          <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" aria-hidden="true" />
        </button>

        {/* Date Display / Page Indicator */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className={`
            relative flex items-center gap-2 px-3 py-1.5 rounded-lg
            bg-slate-900/80 border border-white/10 backdrop-blur-sm
            transition-all duration-300 ease-[0.16,1,0.3,1]
            ${isTodayView 
              ? 'border-emerald-500/30 bg-emerald-500/5 shadow-lg shadow-emerald-500/10' 
              : 'hover:border-white/20'
            }
          `}>
            {/* Live indicator for today */}
            {isTodayView && (
              <span className="relative flex items-center gap-1" aria-live="polite">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-medium text-emerald-300 font-mono tracking-wider">LIVE</span>
              </span>
            )}

            {/* Date range display */}
            <div className="text-center min-w-[140px]">
              <time 
                dateTime={currentViewNewestDate || new Date().toISOString()}
                className="block text-sm font-semibold text-white font-mono tracking-tight select-none"
              >
                {formatDateRange()}
              </time>
              <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                Page {currentPageDisplay} of {totalPages}
              </span>
            </div>

            {/* Calendar icon */}
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          </div>
        </div>

        {/* Next Day (Newer) - Right Arrow */}
        <button
          ref={nextBtnRef}
          onClick={(e) => {
            e.stopPropagation();
            if (!effectiveIsAtLatest && !isLoading) onNavigate(Math.max(0, offset - pageSize));
          }}
          disabled={effectiveIsAtLatest || isLoading}
          aria-label="Newer entries (→)"
          aria-disabled={effectiveIsAtLatest || isLoading}
          className={`
            relative flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-lg touch-manipulation shrink-0
            transition-all duration-200 ease-[0.16,1,0.3,1]
            ${effectiveIsAtLatest || isLoading
              ? 'opacity-30 cursor-not-allowed text-slate-600 bg-slate-900 border border-white/5'
              : 'text-slate-300 bg-slate-900 border border-white/10 hover:text-white hover:border-emerald-500/50 hover:bg-slate-800/50 active:scale-95'
            }
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50
          `}
        >
          <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Jump to Today button (shown when not at latest) */}
      {!effectiveIsAtLatest && (
        <button
          ref={todayBtnRef}
          onClick={() => !isLoading && onGoToday()}
          disabled={isLoading}
          aria-label="Jump to today"
          className={`
            absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] 
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-slate-900/90 border border-emerald-500/30 text-emerald-300
            text-xs font-medium font-mono backdrop-blur-sm
            transition-all duration-200 ease-[0.16,1,0.3,1]
            hover:bg-emerald-500/10 hover:border-emerald-500/50
            active:scale-95 opacity-0 invisible pointer-events-none
            group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <Zap className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Jump to Today</span>
          <kbd className="px-1 py-0.5 text-[9px] bg-slate-800 rounded border border-white/10 text-slate-400">Home</kbd>
        </button>
      )}

      {/* Progress indicator - subtle line showing position in history */}
      <div className="mt-3 h-0.5 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentPage} aria-valuemin={0} aria-valuemax={totalPages - 1} aria-label="Position in feed history">
        <div 
          className="h-full bg-emerald-500/60 rounded-full transition-all duration-500 ease-[0.16,1,0.3,1]"
          style={{ width: totalPages > 1 ? `${(currentPage / (totalPages - 1)) * 100}%` : '0%' }}
        />
      </div>
    </div>
  );
}