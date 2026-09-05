import React, { useState } from 'react';
import { Clock, RotateCcw, Flame, Activity, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { OpeningLog } from '../types';

interface HistoryAndStatsProps {
  count: number;
  history: OpeningLog[];
  onReset: () => void;
}

export const HistoryAndStats: React.FC<HistoryAndStatsProps> = ({
  count,
  history,
  onReset,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Estimate cold air lost / electricity impact in home units
  const estimatedColdAirLost = (count * 2.8).toFixed(1);

  // Calculate average interval
  let avgIntervalMinutes = 'തുടങ്ങിയിട്ടില്ല';
  if (history.length > 1) {
    const diffs: number[] = [];
    for (let i = 0; i < history.length - 1; i++) {
      diffs.push(Math.abs(history[i].timestamp - history[i + 1].timestamp));
    }
    const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const mins = Math.round(avgMs / 60000);
    avgIntervalMinutes = mins < 1 ? '< 1 മിനിറ്റ്' : `${mins} മിനിറ്റ്`;
  }

  // Hunger vs Boredom estimation
  const boredomPercent = Math.min(98, Math.max(15, count * 7));

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-stone-200 shadow-xl p-5 text-stone-800 space-y-4">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900 font-['Noto_Sans_Malayalam']">
              ഫ്രിഡ്ജ് സന്ദർശന ചരിത്രം (Visit Stats)
            </h3>
            <p className="text-xs text-stone-500">
              ഇന്ന് ആകെ {history.length} തവണ ഫ്രിഡ്ജ് തുറന്നു നോക്കി
            </p>
          </div>
        </div>

        {/* Reset Counter Button */}
        <div>
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 shadow-xs cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>റീസെറ്റ്</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  onReset();
                  setShowConfirmReset(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                ശരി
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 rounded-lg bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
              >
                വേണ്ട
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3 Metric Cards for Home Kitchen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Metric 1: Power & Cold loss */}
        <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-3 text-left shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 font-['Noto_Sans_Malayalam'] flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            തണുപ്പ് നഷ്ടം (Air Loss)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-stone-900 font-mono">
              {estimatedColdAirLost}
            </span>
            <span className="text-xs font-semibold text-stone-500">kJ</span>
          </div>
          {/* Visual meter bar */}
          <div className="w-full h-2 rounded-full bg-stone-200 mt-2 overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(8, count * 5))}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Interval gap */}
        <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-3 text-left shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 font-['Noto_Sans_Malayalam'] flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-500" />
            ഇടവേള (Interval)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-stone-900 font-['Noto_Sans_Malayalam']">
              {avgIntervalMinutes}
            </span>
          </div>
          {/* Visual meter bar */}
          <div className="w-full h-2 rounded-full bg-stone-200 mt-2 overflow-hidden">
            <div 
              className="h-full bg-sky-500 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(15, count * 8))}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Boredom ratio */}
        <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-3 text-left shadow-xs">
          <span className="text-[11px] font-bold text-stone-500 font-['Noto_Sans_Malayalam'] flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-500" />
            വിശപ്പല്ല, ബോറടി!
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-stone-900 font-mono">
              {boredomPercent}%
            </span>
          </div>
          {/* Visual meter bar */}
          <div className="w-full h-2 rounded-full bg-stone-200 mt-2 overflow-hidden">
            <div 
              className="h-full bg-rose-500 rounded-full transition-all duration-500" 
              style={{ width: `${boredomPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-stone-700 font-['Noto_Sans_Malayalam']">
            തുറന്ന സമയവും ഡയലോഗുകളും
          </span>
          {history.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>{isExpanded ? 'ചുരുക്കുക' : `മുഴുവൻ കാണൂ (${history.length})`}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-6 text-center rounded-2xl bg-stone-50 border border-stone-200 text-stone-500 text-xs font-medium font-['Noto_Sans_Malayalam']">
            ഇതുവരെ ഫ്രിഡ്ജ് തുറന്നിട്ടില്ല. ഫ്രിഡ്ജ് ഹാൻഡിലിൽ തൊടുക അല്ലെങ്കിൽ സ്പേസ് ബാർ അമർത്തുക!
          </div>
        ) : (
          <div 
            className={`space-y-2 overflow-y-auto pr-1 transition-all ${
              isExpanded ? 'max-h-64' : 'max-h-44'
            }`}
          >
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:bg-stone-100 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-amber-400 text-stone-900 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                    #{item.count}
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-stone-800 font-['Noto_Sans_Malayalam'] block truncate">
                      {item.dialogue ? item.dialogue.malayalam : 'ഫ്രിഡ്ജ് തുറന്നു നോക്കി'}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {item.dialogue?.character || 'വീട്ടു ഫ്രിഡ്ജ്'} {item.timeSinceLast ? `• +${item.timeSinceLast} ഇടവേള` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.snackDiscovered && (
                    <span className="text-base" title={`കണ്ടെത്തിയത്: ${item.snackDiscovered}`}>
                      {item.snackDiscovered}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-lg border border-stone-200">
                    {item.formattedTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
