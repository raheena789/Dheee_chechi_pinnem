import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Sparkles, MessageSquare, ChevronRight, RotateCcw } from 'lucide-react';
import { MalayalamDialogue } from '../types';
import { MALAYALAM_DIALOGUES } from '../data/malayalamDialogues';
import { SoundEngine } from '../utils/audio';

interface MalayalamDialogueBannerProps {
  currentDialogue: MalayalamDialogue;
  count: number;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onSelectDialogue: (dialogue: MalayalamDialogue) => void;
}

export const MalayalamDialogueBanner: React.FC<MalayalamDialogueBannerProps> = ({
  currentDialogue,
  count,
  isVoiceActive,
  onToggleVoice,
  onSelectDialogue
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAllDialogues, setShowAllDialogues] = useState(false);

  const handlePlayVoice = (dialogue: MalayalamDialogue = currentDialogue) => {
    setIsSpeaking(true);
    SoundEngine.playMalayalamStinger(dialogue.audioStinger || 'boing');
    SoundEngine.speakMalayalam(dialogue.malayalam, dialogue.transliteration, () => {
      setIsSpeaking(false);
    });
  };

  return (
    <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl p-5 border-2 border-amber-200/80 shadow-xl space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎙️</span>
          <div>
            <h3 className="text-sm font-bold text-stone-800 font-['Noto_Sans_Malayalam'] flex items-center gap-1.5">
              <span>മലയാളം കോമഡി ഡയലോഗ്</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                #{count} തവണ
              </span>
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              ഫ്രിഡ്ജ് തുറക്കുമ്പോഴുള്ള രസകരമായ പ്രതികരണങ്ങൾ
            </p>
          </div>
        </div>

        {/* Voice Speech Toggle & Play Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleVoice}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
              isVoiceActive
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                : 'bg-stone-100 text-stone-500 border-stone-200'
            }`}
            title={isVoiceActive ? 'Voice narration ON' : 'Voice narration MUTED'}
          >
            {isVoiceActive ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            <span className="hidden sm:inline text-[11px]">
              {isVoiceActive ? 'ശബ്ദം ON' : 'ശബ്ദം MUTE'}
            </span>
          </button>

          <button
            onClick={() => handlePlayVoice()}
            disabled={isSpeaking}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
              isSpeaking
                ? 'bg-amber-400 text-stone-900 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
            }`}
            title="Listen to this dialogue"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'പറയുന്നു...' : 'കേൾക്കൂ!'}</span>
          </button>
        </div>
      </div>

      {/* Main Active Dialogue Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDialogue.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-amber-50/70 via-orange-50/50 to-amber-100/40 rounded-2xl p-4 border border-amber-200/90 shadow-sm relative overflow-hidden"
        >
          {/* Character Avatar & Malayalam Text */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-amber-200 flex items-center justify-center text-2xl shrink-0">
              {currentDialogue.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-amber-900 font-['Noto_Sans_Malayalam']">
                  {currentDialogue.character}
                </span>
                <span className="text-[10px] text-stone-400">
                  • {count >= currentDialogue.minCount ? `${currentDialogue.minCount}+ തവണ` : 'പ്രത്യേകം'}
                </span>
              </div>

              {/* Main Malayalam Dialogue */}
              <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug font-['Noto_Sans_Malayalam']">
                "{currentDialogue.malayalam}"
              </p>

              {/* English Transliteration & Meaning */}
              <div className="mt-2 pt-2 border-t border-amber-200/60 space-y-1">
                <p className="text-xs text-amber-800/90 font-medium italic">
                  🗣️ "{currentDialogue.transliteration}"
                </p>
                <p className="text-[11px] text-stone-600 font-normal">
                  💡 {currentDialogue.englishMeaning}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Dialogues Explorer Toggle */}
      <div className="pt-1 flex items-center justify-between">
        <button
          onClick={() => setShowAllDialogues(!showAllDialogues)}
          className="text-xs text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {showAllDialogues ? 'ഡയലോഗ് ലിസ്റ്റ് ചുരുക്കുക' : `എല്ലാ കോമഡി ഡയലോഗുകളും കാണൂ (${MALAYALAM_DIALOGUES.length})`}
          </span>
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllDialogues ? 'rotate-90' : ''}`} />
        </button>

        <span className="text-[11px] text-stone-500 font-medium font-['Noto_Sans_Malayalam']">
          കൂടുതൽ തവണ തുറക്കുമ്പോൾ കൂടുതൽ കലിപ്പുകൾ! 😂
        </span>
      </div>

      {/* Expandable Dialogues List Drawer */}
      {showAllDialogues && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-2 pt-2 border-t border-stone-100 max-h-60 overflow-y-auto pr-1"
        >
          {MALAYALAM_DIALOGUES.map((d) => (
            <div
              key={d.id}
              onClick={() => {
                onSelectDialogue(d);
                handlePlayVoice(d);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                currentDialogue.id === d.id
                  ? 'bg-amber-100/90 border-amber-300 shadow-sm'
                  : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{d.avatar}</span>
                <div className="truncate">
                  <p className="text-xs font-bold text-stone-800 font-['Noto_Sans_Malayalam'] truncate">
                    {d.malayalam}
                  </p>
                  <p className="text-[10px] text-stone-500 truncate">
                    {d.character} • {d.englishMeaning}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  #{d.minCount}+
                </span>
                <Volume2 className="w-3.5 h-3.5 text-stone-500 hover:text-amber-700" />
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
