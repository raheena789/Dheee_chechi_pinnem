import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Thermometer, Wind, Pencil, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { FridgeColor, FridgeSnack, FridgeNote, FridgeMagnet } from '../types';
import { SoundEngine } from '../utils/audio';

interface FridgeVisualProps {
  isOpen: boolean;
  onToggleDoor: () => void;
  color: FridgeColor;
  snacks: FridgeSnack[];
  activeSnackDiscovery: FridgeSnack | null;
  count: number;
  notes: FridgeNote[];
  activeNoteIndex: number;
  onChangeActiveNoteIndex: (index: number) => void;
  onOpenEditWritingsModal: () => void;
  magnets: FridgeMagnet[];
}

const COLOR_THEMES: Record<FridgeColor, {
  name: string;
  doorBg: string;
  bodyBg: string;
  trim: string;
  handle: string;
  accent: string;
}> = {
  maroon: {
    name: 'Classic Home Maroon (നാടൻ മെറൂൺ)',
    doorBg: 'bg-gradient-to-b from-[#8B1E3F] via-[#75122F] to-[#54081E] text-amber-50',
    bodyBg: 'bg-[#400616]',
    trim: 'border-[#54081E]',
    handle: 'bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 text-stone-800 border-stone-300 shadow-md',
    accent: 'bg-amber-400 text-stone-950'
  },
  mint: {
    name: 'Vintage Mint (വിന്റേജ് മിന്റ്)',
    doorBg: 'bg-gradient-to-b from-[#94C9B8] via-[#7CB9A5] to-[#5F9C88] text-emerald-950',
    bodyBg: 'bg-[#4B8270]',
    trim: 'border-[#5F9C88]',
    handle: 'bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 text-stone-800 border-stone-300 shadow-md',
    accent: 'bg-emerald-700 text-white'
  },
  cream: {
    name: 'Warm Ivory (ക്രീം ഐവറി)',
    doorBg: 'bg-gradient-to-b from-[#FFF8E7] via-[#F4E8CB] to-[#E6D4AF] text-stone-800',
    bodyBg: 'bg-[#C5B38B]',
    trim: 'border-[#C5B38B]',
    handle: 'bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 text-stone-800 border-stone-400 shadow-md',
    accent: 'bg-amber-600 text-white'
  },
  steel: {
    name: 'Brushed Steel (സ്റ്റീൽ ഫിനിഷ്)',
    doorBg: 'bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 text-slate-900',
    bodyBg: 'bg-slate-600',
    trim: 'border-slate-500',
    handle: 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 text-white border-slate-600 shadow-md',
    accent: 'bg-slate-800 text-white'
  },
  sapphire: {
    name: 'Royal Sapphire (റോയൽ ബ്ലൂ)',
    doorBg: 'bg-gradient-to-b from-[#1E3A8A] via-[#172554] to-[#0F172A] text-sky-100',
    bodyBg: 'bg-[#0A0F1D]',
    trim: 'border-[#172554]',
    handle: 'bg-gradient-to-b from-stone-100 via-stone-200 to-stone-300 text-stone-800 border-stone-300 shadow-md',
    accent: 'bg-sky-400 text-stone-950'
  }
};

export const FridgeVisual: React.FC<FridgeVisualProps> = ({
  isOpen,
  onToggleDoor,
  color,
  snacks,
  activeSnackDiscovery,
  count,
  notes,
  activeNoteIndex,
  onChangeActiveNoteIndex,
  onOpenEditWritingsModal,
  magnets
}) => {
  const [eatenSnack, setEatenSnack] = useState<string | null>(null);
  const theme = COLOR_THEMES[color] || COLOR_THEMES.maroon;

  const currentSticky = notes[activeNoteIndex] || notes[0] || {
    id: 'default',
    text: 'ദേ ചേച്ചി പിന്നെയും! 🧊',
    sub: 'അനിയൻ',
    color: 'bg-amber-100 border-amber-300 text-stone-800',
    pinEmoji: '🍓'
  };

  const handleSnackClick = (e: React.MouseEvent, snack: FridgeSnack) => {
    e.stopPropagation();
    SoundEngine.playSnackCrunch();
    setEatenSnack(snack.id);
    setTimeout(() => setEatenSnack(null), 1400);
  };

  const handleNextSticky = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playMalayalamStinger('boing');
    onChangeActiveNoteIndex((activeNoteIndex + 1) % notes.length);
  };

  const topSnacks = snacks.filter(s => s.shelf === 'top');
  const middleSnacks = snacks.filter(s => s.shelf === 'middle');
  const bottomSnacks = snacks.filter(s => s.shelf === 'bottom');
  const doorSnacks = snacks.filter(s => s.shelf === 'door');

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      
      {/* KITCHEN TOP OF FRIDGE ACCESSORIES */}
      <div className="w-[300px] sm:w-[340px] flex items-end justify-between px-6 -mb-2 z-20 pointer-events-none">
        {/* Money plant pot on fridge top */}
        <div className="flex items-end gap-1 translate-y-1">
          <div className="text-2xl sm:text-3xl filter drop-shadow-md transform -rotate-6">🪴</div>
          <div className="hidden sm:block text-xs font-semibold text-stone-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-stone-200 shadow-sm font-['Noto_Sans_Malayalam']">
            മണി പ്ലാന്റ്
          </div>
        </div>

        {/* Vintage kitchen clock / fruit */}
        <div className="flex items-center gap-2 translate-y-1">
          <div className="text-xl sm:text-2xl filter drop-shadow-md">⏰</div>
          <div className="text-lg sm:text-xl filter drop-shadow-md">🍌</div>
        </div>
      </div>

      {/* Main Refrigerator 3D Perspective Container */}
      <div 
        className="relative w-[300px] sm:w-[340px] h-[480px] sm:h-[520px] perspective-1500"
        id="fridge-3d-stage"
      >
        {/* Soft Home Wall Floor Cast Shadow */}
        <div className="absolute -bottom-4 inset-x-4 h-8 bg-stone-900/20 blur-lg rounded-full pointer-events-none" />

        {/* Outer Fridge Cabinet Body Shell */}
        <div className={`absolute inset-0 rounded-3xl ${theme.bodyBg} p-2 shadow-2xl transition-colors duration-500`}>
          
          {/* INTERIOR COMPARTMENT (Visible when door swings open) */}
          <div 
            className="relative w-full h-full rounded-2xl bg-[#FCFCF9] border-2 border-stone-200 overflow-hidden shadow-inner flex flex-col justify-between"
          >
            {/* Warm Home Fridge Light Bulb Glow */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-10 ${
                isOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: 'radial-gradient(ellipse at 50% 12%, rgba(254, 240, 138, 0.45) 0%, rgba(255, 255, 255, 0) 75%)'
              }}
            />

            {/* Frost Vapor Mist Animation when open */}
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 0.8, y: 15 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-x-0 top-12 h-40 pointer-events-none z-20 flex justify-center items-start overflow-hidden"
                >
                  <div className="w-full h-full bg-gradient-to-b from-sky-200/35 via-cyan-100/15 to-transparent blur-sm animate-frost" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Interior Ceiling Light Fixture & Thermometer */}
            <div className="relative px-3 pt-2.5 pb-1 flex items-center justify-between z-20 bg-stone-100/70 border-b border-stone-200/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm animate-pulse" />
                <span className="text-[10px] font-bold text-stone-600 font-['Noto_Sans_Malayalam']">
                  തണുപ്പ്: സാധാരണ
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-stone-700 border border-stone-200 shadow-xs text-[11px] font-semibold">
                <Thermometer className="w-3 h-3 text-sky-500" />
                <span>3.4°C</span>
              </div>
            </div>

            {/* INTERIOR SHELVES & FOOD */}
            <div className="relative flex-1 flex flex-col justify-between p-3 z-20">
              
              {/* TOP SHELF (Payasam, Milk, Chocolate) */}
              <div className="relative flex flex-col justify-end h-[115px] border-b-2 border-stone-300 pb-1.5 bg-gradient-to-b from-white/40 to-stone-100/40 rounded-t-lg">
                <div className="absolute top-1 left-1.5 text-[9px] font-semibold text-stone-400 font-['Noto_Sans_Malayalam']">
                  മുകൾ തട്ട് (Top Shelf)
                </div>
                <div className="flex items-end justify-around px-2">
                  {topSnacks.map((snack) => (
                    <button
                      key={snack.id}
                      onClick={(e) => handleSnackClick(e, snack)}
                      className="group relative text-3xl sm:text-4xl hover:scale-125 transition-transform duration-150 cursor-pointer p-1"
                      title={`${snack.name}: ${snack.comment}`}
                    >
                      <span className="inline-block transition-transform active:scale-90">{snack.icon}</span>
                      {eatenSnack === snack.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-stone-900 bg-amber-200 border border-amber-300 rounded-lg px-2 py-0.5 whitespace-nowrap shadow-md font-['Noto_Sans_Malayalam']">
                          സ്വാദോടെ കഴിച്ചു! 😋
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* MIDDLE SHELF (Biryani, Achar, Fish Curry) */}
              <div className="relative flex flex-col justify-end h-[125px] border-b-2 border-stone-300 pb-1.5 bg-gradient-to-b from-white/40 to-stone-100/40">
                <div className="absolute top-1 left-1.5 text-[9px] font-semibold text-stone-400 font-['Noto_Sans_Malayalam']">
                  നടുവിലെ തട്ട് (Curry & Snacks)
                </div>
                <div className="flex items-end justify-around px-2">
                  {middleSnacks.map((snack) => (
                    <button
                      key={snack.id}
                      onClick={(e) => handleSnackClick(e, snack)}
                      className="group relative text-3xl sm:text-4xl hover:scale-125 transition-transform duration-150 cursor-pointer p-1"
                      title={`${snack.name}: ${snack.comment}`}
                    >
                      <span className="inline-block transition-transform active:scale-90">{snack.icon}</span>
                      {snack.rarity === 'legendary' && (
                        <span className="absolute -top-2 -right-1 flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border border-white"></span>
                        </span>
                      )}
                      {eatenSnack === snack.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-stone-900 bg-emerald-200 border border-emerald-300 rounded-lg px-2 py-0.5 whitespace-nowrap shadow-md font-['Noto_Sans_Malayalam']">
                          അടിപൊളി! 🍲
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* BOTTOM VEGETABLE & FRUIT CRISPER DRAWER */}
              <div className="relative flex flex-col justify-end h-[125px] bg-gradient-to-t from-emerald-50/70 to-stone-50 border border-stone-300/80 rounded-xl p-2 shadow-xs">
                <div className="absolute top-1.5 left-2 text-[10px] font-bold text-emerald-800/80 flex items-center gap-1 font-['Noto_Sans_Malayalam']">
                  <Wind className="w-3 h-3 text-emerald-600" />
                  പച്ചക്കറി & പഴങ്ങൾ (Crisper)
                </div>
                <div className="flex items-end justify-around px-1 mb-1">
                  {bottomSnacks.map((snack) => (
                    <button
                      key={snack.id}
                      onClick={(e) => handleSnackClick(e, snack)}
                      className="group relative text-3xl sm:text-4xl hover:scale-125 transition-transform duration-150 cursor-pointer p-1"
                      title={`${snack.name}: ${snack.comment}`}
                    >
                      <span className="inline-block transition-transform active:scale-90">{snack.icon}</span>
                      {eatenSnack === snack.id && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-bold text-stone-900 bg-amber-200 border border-amber-300 rounded-lg px-2 py-0.5 whitespace-nowrap shadow-md font-['Noto_Sans_Malayalam']">
                          നല്ല മധുരം! 🥭
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3D REFRIGERATOR HOME DOOR */}
        <div
          id="fridge-door-pivot"
          onClick={onToggleDoor}
          className={`absolute inset-0 cursor-pointer transform-style-3d origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-30 ${
            isOpen ? '-rotate-y-[108deg]' : 'rotate-y-0'
          }`}
          style={{
            transform: isOpen ? 'rotateY(-108deg)' : 'rotateY(0deg)',
          }}
        >
          {/* DOOR EXTERIOR (Front Face) */}
          <div 
            className={`absolute inset-0 rounded-3xl ${theme.doorBg} border-4 ${theme.trim} shadow-2xl backface-hidden flex flex-col justify-between p-5 overflow-hidden`}
          >
            {/* Glossy Curved Enamel Reflection Streak */}
            <div className="absolute inset-y-0 left-6 w-16 bg-gradient-to-r from-white/25 to-transparent pointer-events-none rounded-full transform -skew-x-12" />

            {/* Top Brand Emblem Badge */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-md text-stone-800 rounded-full shadow-md border border-white/50">
                <span className="text-base">🏡</span>
                <span className="text-xs font-bold tracking-wide font-['Noto_Sans_Malayalam']">
                  വീട്ടു ഫ്രിഡ്ജ്
                </span>
              </div>

              {/* Energy Star Rating */}
              <div className="flex items-center gap-1 bg-amber-400/90 text-stone-900 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm">
                <span>★ 5 STAR</span>
              </div>
            </div>

            {/* Refrigerator Center: Door Magnets & EDITABLE Sticky Notes */}
            <div className="relative z-10 flex flex-col items-center my-auto gap-2.5">
              
              {/* Home Sticky Note held by cute magnet with EDIT BUTTON */}
              <div 
                onClick={handleNextSticky}
                title="ക്ലിക്ക് ചെയ്ത് അടുത്ത കുറിപ്പ് കാണൂ!"
                className={`group relative ${currentSticky.color} p-3.5 rounded-xl border-2 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer max-w-[225px] w-full`}
              >
                {/* Cute Circular Fruit / Custom Magnet Pin */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center text-xs">
                  {currentSticky.pinEmoji || '🍓'}
                </div>

                {/* EDIT WRITINGS PENCIL BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditWritingsModal();
                  }}
                  className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-white text-stone-700 hover:text-amber-600 hover:scale-110 shadow-md border border-stone-200 flex items-center justify-center transition-all cursor-pointer z-30"
                  title="എഴുത്തുകൾ മാറ്റുക (Edit Writings)"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Note message text */}
                <p className="text-sm font-bold leading-snug text-center select-none pt-2 font-['Noto_Sans_Malayalam']">
                  "{currentSticky.text}"
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/10 text-[10px] text-stone-600">
                  <span className="font-semibold font-['Noto_Sans_Malayalam'] truncate max-w-[120px]">
                    — {currentSticky.sub}
                  </span>
                  <span className="text-[9px] underline text-stone-500 hover:text-stone-800">
                    മാറ്റാൻ ടാപ്പ് ചെയ്യൂ
                  </span>
                </div>
              </div>

              {/* Editable Door Magnets */}
              <div className="flex items-center gap-2 mt-1">
                {magnets.map((mag) => (
                  <div
                    key={mag.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEditWritingsModal();
                    }}
                    title="മാഗ്നറ്റുകൾ മാറ്റാൻ ക്ലിക്ക് ചെയ്യൂ"
                    className="px-2.5 py-1 bg-white/95 hover:bg-amber-50 text-stone-800 rounded-lg text-xs font-bold shadow-md transform hover:scale-105 transition-transform flex items-center gap-1 border border-stone-200 cursor-pointer"
                  >
                    <span>{mag.emoji}</span>
                    <span className="font-['Noto_Sans_Malayalam']">{mag.label}</span>
                  </div>
                ))}
                
                <div className="px-2.5 py-1 bg-amber-400 text-stone-900 rounded-lg text-xs font-extrabold shadow-md transform -rotate-3 border border-amber-300">
                  #{count} തവണ
                </div>
              </div>
            </div>

            {/* Home Refrigerator Chrome Latch Handle */}
            <div 
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-40 ${theme.handle} rounded-xl border flex flex-col justify-between py-3 items-center z-20 cursor-pointer group hover:scale-105 transition-transform`}
              title="Click handle to open fridge"
            >
              <div className="w-4 h-1.5 bg-stone-400 rounded-full" />
              <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider -rotate-90 whitespace-nowrap font-['Noto_Sans_Malayalam']">
                തുറക്കൂ
              </div>
              <div className="w-4 h-1.5 bg-stone-400 rounded-full" />
            </div>

            {/* Bottom Hint */}
            <div className="relative z-10 text-center">
              <span className="text-[11px] font-semibold bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full shadow-sm font-['Noto_Sans_Malayalam']">
                {isOpen ? 'കതക് അടയ്ക്കാൻ ക്ലിക്ക് ചെയ്യൂ' : 'ഫ്രിഡ്ജ് തുറക്കാൻ ഹാൻഡിൽ വലിക്കൂ'}
              </span>
            </div>
          </div>

          {/* DOOR INTERIOR (Back Face with inside door racks) */}
          <div 
            className="absolute inset-0 rounded-3xl border-4 border-stone-300 bg-[#FAF9F5] shadow-xl p-4 flex flex-col justify-around rotate-y-180 backface-hidden"
            style={{
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="text-center text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200 pb-1 font-['Noto_Sans_Malayalam']">
              കതകിലെ റാക്ക് (Door Shelves)
            </div>

            {/* Top Door Bin (Drinks & Bottles) */}
            <div className="h-24 bg-white rounded-xl border border-stone-200 shadow-xs p-2 flex items-center justify-around">
              {doorSnacks.map(snack => (
                <button
                  key={snack.id}
                  onClick={(e) => handleSnackClick(e, snack)}
                  className="text-3xl hover:scale-125 transition-transform cursor-pointer"
                  title={snack.name}
                >
                  {snack.icon}
                </button>
              ))}
            </div>

            {/* Bottom Door Bin (Pickles, Condiments, Lemons) */}
            <div className="h-28 bg-white rounded-xl border border-stone-200 shadow-xs p-2 flex items-center justify-around">
              <div className="flex flex-col items-center">
                <span className="text-3xl hover:scale-110 transition-transform">🏺</span>
                <span className="text-[9px] text-stone-500 font-bold font-['Noto_Sans_Malayalam']">അച്ചാർ</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl hover:scale-110 transition-transform">🍋</span>
                <span className="text-[9px] text-stone-500 font-bold font-['Noto_Sans_Malayalam']">നാരങ്ങ</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl hover:scale-110 transition-transform">🥛</span>
                <span className="text-[9px] text-stone-500 font-bold font-['Noto_Sans_Malayalam']">തൈര്</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK WRITINGS EDIT BAR BELOW FRIDGE */}
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={onOpenEditWritingsModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-stone-200 hover:border-amber-300 shadow-xs text-xs font-bold transition-all cursor-pointer font-['Noto_Sans_Malayalam']"
          title="ഫ്രിഡ്ജിലെ എഴുത്തുകൾ മാറ്റുക"
        >
          <Pencil className="w-3.5 h-3.5 text-amber-600" />
          <span>എഴുത്തുകൾ മാറ്റുക (Edit Writings)</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full">
            {notes.length}
          </span>
        </button>

        {notes.length > 1 && (
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-full px-2 py-0.5 shadow-xs text-xs">
            <button
              onClick={() => onChangeActiveNoteIndex((activeNoteIndex - 1 + notes.length) % notes.length)}
              className="p-1 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title="മുൻപത്തെ നോട്ട്"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-stone-600 font-mono px-1">
              {activeNoteIndex + 1}/{notes.length}
            </span>
            <button
              onClick={() => onChangeActiveNoteIndex((activeNoteIndex + 1) % notes.length)}
              className="p-1 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              title="അടുത്ത നോട്ട്"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Active Snack Discovery Toast */}
      <AnimatePresence>
        {activeSnackDiscovery && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            className="mt-3 flex items-center gap-3 px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200 shadow-xl max-w-sm"
          >
            <span className="text-2xl">{activeSnackDiscovery.icon}</span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-900 font-['Noto_Sans_Malayalam']">{activeSnackDiscovery.name}</span>
                {activeSnackDiscovery.rarity === 'legendary' && (
                  <span className="text-[10px] font-extrabold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full shadow-xs">
                    സ്പെഷ്യൽ! ✨
                  </span>
                )}
              </div>
              <p className="text-[11px] font-medium text-stone-600 line-clamp-1">{activeSnackDiscovery.comment}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
