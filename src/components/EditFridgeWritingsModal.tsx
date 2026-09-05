import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Check, RotateCcw, Sparkles, Smile } from 'lucide-react';
import { FridgeNote, FridgeMagnet } from '../types';

interface EditFridgeWritingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: FridgeNote[];
  activeNoteIndex: number;
  onSaveNotes: (notes: FridgeNote[], activeIndex: number) => void;
  magnets: FridgeMagnet[];
  onSaveMagnets: (magnets: FridgeMagnet[]) => void;
}

const PIN_EMOJIS = ['🍓', '🍋', '🥭', '🥥', '🍌', '🌶️', '❤️', '⭐', '📌', '🧊'];

const NOTE_COLORS = [
  { id: 'yellow', name: 'മഞ്ഞ (Yellow)', class: 'bg-amber-100 border-amber-300 text-stone-800' },
  { id: 'rose', name: 'റോസ് (Rose)', class: 'bg-rose-100 border-rose-300 text-stone-800' },
  { id: 'green', name: 'പച്ച (Green)', class: 'bg-emerald-100 border-emerald-300 text-stone-800' },
  { id: 'blue', name: 'നീല (Blue)', class: 'bg-sky-100 border-sky-300 text-stone-800' },
  { id: 'purple', name: 'പർപ്പിൾ (Purple)', class: 'bg-purple-100 border-purple-300 text-stone-800' },
];

const PRESET_IDEAS = [
  { text: "ദേ ചേച്ചി പിന്നെയും! 🧊", sub: "അനിയന്റെ മുന്നറിയിപ്പ്", pin: "🍓" },
  { text: "രാത്രി ചോക്ലേറ്റ് തൊട്ടുപോകരുത്! 🍫", sub: "ചേച്ചിയുടെ വക", pin: "❤️" },
  { text: "പാല്, മുട്ട, മീൻ, തൈര് വാങ്ങണം! 📝", sub: "അമ്മയുടെ ലിസ്റ്റ്", pin: "📌" },
  { text: "ഡയറ്റ് നാളെ മുതൽ തുടങ്ങാം! 🏃", sub: "ദൃഢനിശ്ചയം", pin: "🍌" },
  { text: "വിശപ്പല്ല... വെറും ബോറടിയാണ്! 🧠", sub: "അച്ഛൻ", pin: "⭐" },
  { text: "അമ്മയുടെ സ്പെഷ്യൽ മീൻ കറി ഉള്ളിലുണ്ട്! 🥘", sub: "രഹസ്യ നിധി", pin: "🌶️" },
  { text: "ഫ്രിഡ്ജ് തുറന്ന് നോക്കിയാൽ ഒന്നും മാറില്ല! 👀", sub: "പാവം കംപ്രസ്സർ", pin: "🧊" },
  { text: "ആഹാരം കഴിക്കാൻ സമയമായിട്ടില്ല! ⏰", sub: "അമ്മ", pin: "🍋" }
];

export const DEFAULT_FRIDGE_NOTES: FridgeNote[] = [
  { id: 'note-1', text: "ദേ ചേച്ചി പിന്നെയും! 🧊", sub: "അനിയന്റെ മുന്നറിയിപ്പ്", color: "bg-amber-100 border-amber-300 text-stone-800", pinEmoji: "🍓" },
  { id: 'note-2', text: "പാല്, മുട്ട, മീൻ, തൈര് വാങ്ങണം! 📝", sub: "അമ്മയുടെ ലിസ്റ്റ്", color: "bg-rose-100 border-rose-300 text-stone-800", pinEmoji: "📌" },
  { id: 'note-3', text: "രാത്രി ചോക്ലേറ്റ് തൊട്ടുപോകരുത്! 🍫", sub: "ചേച്ചിയുടെ വക", color: "bg-amber-100 border-amber-300 text-stone-800", pinEmoji: "❤️" },
  { id: 'note-4', text: "വിശപ്പല്ല... വെറും ബോറടിയാണ്! 🧠", sub: "അച്ഛൻ", color: "bg-emerald-100 border-emerald-300 text-stone-800", pinEmoji: "⭐" },
  { id: 'note-5', text: "ഫ്രിഡ്ജിൽ പുതിയതൊന്നും വന്നിട്ടില്ല! 👀", sub: "പാവം കംപ്രസ്സർ", color: "bg-sky-100 border-sky-300 text-stone-800", pinEmoji: "🧊" }
];

export const DEFAULT_FRIDGE_MAGNETS: FridgeMagnet[] = [
  { id: 'mag-1', emoji: '🥥', label: 'നാടൻ' },
  { id: 'mag-2', emoji: '❤️', label: 'അമ്മ' },
];

export const EditFridgeWritingsModal: React.FC<EditFridgeWritingsModalProps> = ({
  isOpen,
  onClose,
  notes,
  activeNoteIndex,
  onSaveNotes,
  magnets,
  onSaveMagnets,
}) => {
  const [localNotes, setLocalNotes] = useState<FridgeNote[]>(notes);
  const [currentIndex, setCurrentIndex] = useState<number>(activeNoteIndex);
  const [localMagnets, setLocalMagnets] = useState<FridgeMagnet[]>(magnets);
  const [activeTab, setActiveTab] = useState<'notes' | 'magnets'>('notes');

  if (!isOpen) return null;

  const currentNote = localNotes[currentIndex] || localNotes[0];

  const handleUpdateCurrentNote = (field: Partial<FridgeNote>) => {
    setLocalNotes((prev) => {
      const updated = [...prev];
      if (updated[currentIndex]) {
        updated[currentIndex] = { ...updated[currentIndex], ...field };
      }
      return updated;
    });
  };

  const handleAddNewNote = () => {
    const newNote: FridgeNote = {
      id: `note-${Date.now()}`,
      text: "പുതിയ കുറിപ്പ് എഴുതൂ...",
      sub: "ഞാൻ",
      color: "bg-amber-100 border-amber-300 text-stone-800",
      pinEmoji: "📌"
    };
    const updated = [...localNotes, newNote];
    setLocalNotes(updated);
    setCurrentIndex(updated.length - 1);
  };

  const handleDeleteCurrentNote = () => {
    if (localNotes.length <= 1) return;
    const updated = localNotes.filter((_, idx) => idx !== currentIndex);
    setLocalNotes(updated);
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleApplyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    handleUpdateCurrentNote({
      text: preset.text,
      sub: preset.sub,
      pinEmoji: preset.pin
    });
  };

  const handleSaveAndClose = () => {
    onSaveNotes(localNotes, currentIndex);
    onSaveMagnets(localMagnets);
    onClose();
  };

  const handleResetDefaults = () => {
    setLocalNotes(DEFAULT_FRIDGE_NOTES);
    setCurrentIndex(0);
    setLocalMagnets(DEFAULT_FRIDGE_MAGNETS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200/80 border border-amber-300 text-amber-900 flex items-center justify-center shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Noto_Sans_Malayalam']">
                ഫ്രിഡ്ജിലെ എഴുത്തുകൾ മാറ്റുക (Edit Fridge Writings)
              </h3>
              <p className="text-xs text-stone-500">
                ഫ്രിഡ്ജിലെ സ്റ്റിക്കി നോട്ടുകളും മാഗ്നറ്റുകളും ഇഷ്ടാനുസരണം മാറ്റാം
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Sticky Notes vs Magnets */}
        <div className="flex items-center px-6 pt-3 border-b border-stone-100 gap-4 bg-stone-50/40">
          <button
            onClick={() => setActiveTab('notes')}
            className={`pb-2.5 text-xs font-bold font-['Noto_Sans_Malayalam'] border-b-2 transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            📝 സ്റ്റിക്കി നോട്ടുകൾ ({localNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('magnets')}
            className={`pb-2.5 text-xs font-bold font-['Noto_Sans_Malayalam'] border-b-2 transition-colors cursor-pointer ${
              activeTab === 'magnets'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            🥥 മാഗ്നറ്റുകൾ ({localMagnets.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'notes' ? (
            <>
              {/* Note Selector Pills & Add Button */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {localNotes.map((note, idx) => (
                    <button
                      key={note.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        currentIndex === idx
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      <span>{note.pinEmoji || '📌'}</span>
                      <span>നോട്ട് {idx + 1}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={handleAddNewNote}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs font-['Noto_Sans_Malayalam']"
                    title="പുതിയ നോട്ട് ചേർക്കുക"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>പുതിയത്</span>
                  </button>

                  {localNotes.length > 1 && (
                    <button
                      onClick={handleDeleteCurrentNote}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="ഈ നോട്ട് കളയുക"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* LIVE STICKY NOTE PREVIEW & DIRECT EDITING */}
              <div className="flex flex-col items-center justify-center p-4 bg-stone-100/70 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 font-mono">
                  ഫ്രിഡ്ജിലെ തത്സമയ രൂപം (PREVIEW)
                </span>
                
                {/* Note Card */}
                <div 
                  className={`relative ${currentNote.color} p-4 rounded-xl border-2 shadow-md w-full max-w-[260px] transform -rotate-1 transition-all`}
                >
                  {/* Pin Magnet */}
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-red-500 border-2 border-white shadow-md flex items-center justify-center text-sm">
                    {currentNote.pinEmoji || '🍓'}
                  </div>

                  <p className="text-sm font-bold leading-snug text-center pt-2 font-['Noto_Sans_Malayalam']">
                    "{currentNote.text}"
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/10 text-[10px] text-stone-600">
                    <span className="font-semibold font-['Noto_Sans_Malayalam']">
                      — {currentNote.sub}
                    </span>
                    <span className="text-[9px] opacity-75">ഫ്രിഡ്ജ് നോട്ട്</span>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                {/* Note Message Text Input */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1 font-['Noto_Sans_Malayalam']">
                    എഴുത്ത് (Note Message)
                  </label>
                  <textarea
                    rows={2}
                    value={currentNote.text}
                    onChange={(e) => handleUpdateCurrentNote({ text: e.target.value })}
                    placeholder="ഫ്രിഡ്ജിൽ ഒട്ടിക്കാനുള്ള വാചകം എഴുതൂ..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-['Noto_Sans_Malayalam'] text-stone-800"
                  />
                </div>

                {/* Subtitle / Author Input */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1 font-['Noto_Sans_Malayalam']">
                    ആരാണ് എഴുതിയത് / അടിക്കുറിപ്പ് (Author / Subtitle)
                  </label>
                  <input
                    type="text"
                    value={currentNote.sub}
                    onChange={(e) => handleUpdateCurrentNote({ sub: e.target.value })}
                    placeholder="ഉദാ: അനിയൻ, അമ്മ, ചേച്ചി..."
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-['Noto_Sans_Malayalam'] text-stone-800"
                  />
                </div>

                {/* Pin Magnet Emoji Picker */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 font-['Noto_Sans_Malayalam']">
                    പിൻ മാഗ്നറ്റ് (Pin Magnet Emoji)
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {PIN_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleUpdateCurrentNote({ pinEmoji: emoji })}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg transition-transform cursor-pointer ${
                          currentNote.pinEmoji === emoji
                            ? 'bg-amber-100 border-amber-400 scale-110 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note Color Picker */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1.5 font-['Noto_Sans_Malayalam']">
                    നോട്ടിന്റെ നിറം (Note Paper Color)
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {NOTE_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleUpdateCurrentNote({ color: c.class })}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          currentNote.color === c.class
                            ? 'ring-2 ring-amber-500 shadow-xs'
                            : 'opacity-80 hover:opacity-100'
                        } ${c.class}`}
                      >
                        <span>{c.name}</span>
                        {currentNote.color === c.class && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets / Malayalam Ideas */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1.5 font-['Noto_Sans_Malayalam']">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>റെഡിമെയ്ഡ് കുറിപ്പുകൾ (Tap to use preset)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                    {PRESET_IDEAS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="p-2 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-left transition-colors cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{preset.pin}</span>
                          <span className="font-bold text-stone-800 font-['Noto_Sans_Malayalam'] truncate">
                            {preset.text}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-medium block mt-0.5 font-['Noto_Sans_Malayalam']">
                          — {preset.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Magnets Tab */
            <div className="space-y-4">
              <p className="text-xs text-stone-500 font-['Noto_Sans_Malayalam']">
                ഫ്രിഡ്ജിന്റെ കതകിലുള്ള രണ്ട് പ്രധാന മാഗ്നറ്റുകൾ നിങ്ങൾക്ക് മാറ്റാം:
              </p>

              {localMagnets.map((mag, idx) => (
                <div key={mag.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-xs font-bold text-stone-700 font-['Noto_Sans_Malayalam']">
                    മാഗ്നറ്റ് {idx + 1}
                  </span>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={2}
                      value={mag.emoji}
                      onChange={(e) => {
                        const updated = [...localMagnets];
                        updated[idx].emoji = e.target.value;
                        setLocalMagnets(updated);
                      }}
                      className="w-12 h-10 text-center text-xl rounded-xl border border-stone-300 focus:border-amber-500 outline-none bg-white shadow-xs"
                      title="Emoji"
                    />

                    <input
                      type="text"
                      maxLength={12}
                      value={mag.label}
                      onChange={(e) => {
                        const updated = [...localMagnets];
                        updated[idx].label = e.target.value;
                        setLocalMagnets(updated);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-300 focus:border-amber-500 outline-none bg-white text-sm font-bold font-['Noto_Sans_Malayalam'] text-stone-800 shadow-xs"
                      placeholder="പേര് എഴുതൂ (Max 12 chars)"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-['Noto_Sans_Malayalam']"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>റീസെറ്റ് ചെയ്യൂ</span>
          </button>

          <button
            onClick={handleSaveAndClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer font-['Noto_Sans_Malayalam']"
          >
            സേവ് ചെയ്ത് മാറ്റൂ (Save Changes)
          </button>
        </div>
      </div>
    </div>
  );
};
