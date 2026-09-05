import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  Palette, 
  DoorOpen, 
  DoorClosed, 
  Flame,
  Coffee,
  Heart,
  Pencil
} from 'lucide-react';
import { SoundProfile, FridgeColor, OpeningLog, UploadedAudio, FridgeSnack, MalayalamDialogue, FridgeNote, FridgeMagnet } from './types';
import { SoundEngine } from './utils/audio';
import { INITIAL_SNACKS } from './data/snacks';
import { getMalayalamDialogue, MALAYALAM_DIALOGUES } from './data/malayalamDialogues';
import { FridgeVisual } from './components/FridgeVisual';
import { MalayalamDialogueBanner } from './components/MalayalamDialogueBanner';
import { SoundBar } from './components/SoundBar';
import { CustomAudioModal } from './components/CustomAudioModal';
import { HistoryAndStats } from './components/HistoryAndStats';
import { EditFridgeWritingsModal, DEFAULT_FRIDGE_NOTES, DEFAULT_FRIDGE_MAGNETS } from './components/EditFridgeWritingsModal';

const LOCAL_STORAGE_KEY = 'dheee_chechi_pinnem_v2';

const HOME_FRIDGE_COLORS: { id: FridgeColor; name: string; bg: string }[] = [
  { id: 'maroon', name: 'നാടൻ മെറൂൺ', bg: 'bg-[#75122F]' },
  { id: 'mint', name: 'വിന്റേജ് മിന്റ്', bg: 'bg-[#7CB9A5]' },
  { id: 'cream', name: 'ക്രീം ഐവറി', bg: 'bg-[#F4E8CB]' },
  { id: 'steel', name: 'സ്റ്റീൽ ഫിനിഷ്', bg: 'bg-slate-300' },
  { id: 'sapphire', name: 'റോയൽ ബ്ലൂ', bg: 'bg-[#1E3A8A]' },
];

export default function App() {
  const [count, setCount] = useState<number>(0);
  const [history, setHistory] = useState<OpeningLog[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('realistic');
  const [fridgeColor, setFridgeColor] = useState<FridgeColor>('maroon');
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  
  // Custom fridge writings (sticky notes & door magnets)
  const [notes, setNotes] = useState<FridgeNote[]>(DEFAULT_FRIDGE_NOTES);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(0);
  const [magnets, setMagnets] = useState<FridgeMagnet[]>(DEFAULT_FRIDGE_MAGNETS);
  const [isEditWritingsModalOpen, setIsEditWritingsModalOpen] = useState<boolean>(false);

  // Custom audio files
  const [uploadedSounds, setUploadedSounds] = useState<UploadedAudio[]>([]);
  const [useCustomAudio, setUseCustomAudio] = useState<boolean>(false);
  const [audioIndex, setAudioIndex] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // Active snack highlight on open
  const [activeSnack, setActiveSnack] = useState<FridgeSnack | null>(null);

  // Active Malayalam dialogue
  const [currentDialogue, setCurrentDialogue] = useState<MalayalamDialogue>(() => getMalayalamDialogue(0));

  // Timer reference for auto-closing door
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial state from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.count === 'number') {
          setCount(parsed.count);
          setCurrentDialogue(getMalayalamDialogue(parsed.count));
        }
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
        if (parsed.soundProfile) setSoundProfile(parsed.soundProfile);
        if (parsed.fridgeColor) setFridgeColor(parsed.fridgeColor);
        if (typeof parsed.volume === 'number') {
          setVolume(parsed.volume);
          SoundEngine.setVolume(parsed.volume);
        }
        if (typeof parsed.isMuted === 'boolean') {
          setIsMuted(parsed.isMuted);
          SoundEngine.setMuted(parsed.isMuted);
        }
        if (typeof parsed.isVoiceActive === 'boolean') {
          setIsVoiceActive(parsed.isVoiceActive);
          SoundEngine.setVoiceEnabled(parsed.isVoiceActive);
        }
        if (Array.isArray(parsed.notes) && parsed.notes.length > 0) {
          setNotes(parsed.notes);
        }
        if (typeof parsed.activeNoteIndex === 'number') {
          setActiveNoteIndex(parsed.activeNoteIndex);
        }
        if (Array.isArray(parsed.magnets) && parsed.magnets.length > 0) {
          setMagnets(parsed.magnets);
        }
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
  }, []);

  // Sync settings with SoundEngine
  useEffect(() => {
    SoundEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    SoundEngine.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    SoundEngine.setVoiceEnabled(isVoiceActive);
  }, [isVoiceActive]);

  // Persist state changes
  const saveState = useCallback((
    newCount: number, 
    newHistory: OpeningLog[],
    newNotes = notes,
    newNoteIdx = activeNoteIndex,
    newMagnets = magnets
  ) => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          count: newCount,
          history: newHistory,
          soundProfile,
          fridgeColor,
          volume,
          isMuted,
          isVoiceActive,
          notes: newNotes,
          activeNoteIndex: newNoteIdx,
          magnets: newMagnets,
        })
      );
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [soundProfile, fridgeColor, volume, isMuted, isVoiceActive, notes, activeNoteIndex, magnets]);

  // Play audio when fridge opens
  const triggerOpenSound = useCallback((dialogue: MalayalamDialogue) => {
    if (isMuted || volume <= 0) return;

    if (useCustomAudio && uploadedSounds.length > 0) {
      try {
        const sound = uploadedSounds[audioIndex % uploadedSounds.length];
        setAudioIndex(prev => prev + 1);
        const audio = new Audio(sound.url);
        audio.volume = volume;
        audio.play().catch(e => console.warn('Custom audio playback error:', e));
      } catch (e) {
        console.warn('Custom audio error, falling back to synthesizer', e);
        SoundEngine.playDoorOpen(soundProfile);
      }
    } else {
      // Play door opening sound
      SoundEngine.playDoorOpen(soundProfile);
    }

    // Play comedic audio stinger & Malayalam dialogue speech
    setTimeout(() => {
      SoundEngine.playMalayalamStinger(dialogue.audioStinger || 'boing');
      if (isVoiceActive) {
        SoundEngine.speakMalayalam(dialogue.malayalam, dialogue.transliteration);
      }
    }, 180);
  }, [isMuted, volume, useCustomAudio, uploadedSounds, audioIndex, soundProfile, isVoiceActive]);

  // Handle open/close fridge door action
  const handleToggleDoor = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isOpen) {
      // Closing door
      setIsOpen(false);
      SoundEngine.playDoorClose(soundProfile);
    } else {
      // Opening door
      const newCount = count + 1;
      setCount(newCount);
      setIsOpen(true);

      // Get next comedic Malayalam dialogue
      const nextDialogue = getMalayalamDialogue(newCount);
      setCurrentDialogue(nextDialogue);

      // Play sound and dialogue
      triggerOpenSound(nextDialogue);

      // Pick a random surprise snack to spotlight
      const randomSnack = INITIAL_SNACKS[Math.floor(Math.random() * INITIAL_SNACKS.length)];
      setActiveSnack(randomSnack);

      // Time calculation
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      let timeSinceLast: string | undefined = undefined;
      if (history.length > 0) {
        const lastTime = history[0].timestamp;
        const diffSeconds = Math.round((now.getTime() - lastTime) / 1000);
        if (diffSeconds < 60) {
          timeSinceLast = `${diffSeconds} സെക്കന്റ്`;
        } else if (diffSeconds < 3600) {
          timeSinceLast = `${Math.round(diffSeconds / 60)} മിനിറ്റ്`;
        } else {
          timeSinceLast = `${(diffSeconds / 3600).toFixed(1)} മണിക്കൂർ`;
        }
      }

      const newLog: OpeningLog = {
        id: `open-${Date.now()}`,
        count: newCount,
        timestamp: now.getTime(),
        formattedTime,
        timeSinceLast,
        snackDiscovered: randomSnack.icon,
        dialogue: nextDialogue,
      };

      const updatedHistory = [newLog, ...history].slice(0, 50);
      setHistory(updatedHistory);
      saveState(newCount, updatedHistory);

      // Milestone celebration confetti
      if ([5, 10, 20, 50, 100].includes(newCount)) {
        SoundEngine.playMilestoneChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6'],
        });
      }

      // Auto shut door after 3.8 seconds
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        SoundEngine.playDoorClose(soundProfile);
      }, 3800);
    }
  }, [isOpen, count, history, soundProfile, triggerOpenSound, saveState]);

  // Spacebar keyboard shortcut to toggle fridge
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleToggleDoor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleDoor]);

  // Reset handler
  const handleReset = () => {
    setCount(0);
    setHistory([]);
    setActiveSnack(null);
    setCurrentDialogue(getMalayalamDialogue(0));
    saveState(0, []);
  };

  // Upload sound handling
  const handleAddSounds = (files: File[]) => {
    const newItems: UploadedAudio[] = files.map((file) => ({
      id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));
    setUploadedSounds((prev) => [...prev, ...newItems]);
    setUseCustomAudio(true);
  };

  const handleRemoveSound = (id: string) => {
    setUploadedSounds((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) setUseCustomAudio(false);
      return filtered;
    });
  };

  const handleClearAllSounds = () => {
    setUploadedSounds([]);
    setUseCustomAudio(false);
  };

  // Writings save handlers
  const handleSaveNotes = (newNotes: FridgeNote[], newActiveIndex: number) => {
    setNotes(newNotes);
    setActiveNoteIndex(newActiveIndex);
    saveState(count, history, newNotes, newActiveIndex, magnets);
  };

  const handleSaveMagnets = (newMagnets: FridgeMagnet[]) => {
    setMagnets(newMagnets);
    saveState(count, history, notes, activeNoteIndex, newMagnets);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 flex flex-col justify-between selection:bg-amber-200 selection:text-stone-900 relative font-sans">
      
      {/* Warm Ambient Kitchen Lighting Glow */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(254, 240, 138, 0.25) 0%, rgba(253, 251, 247, 0) 70%)'
        }}
      />

      {/* Top Header: Home Kitchen Style */}
      <header className="w-full relative z-10 bg-white/85 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white shadow-md flex items-center justify-center text-2xl border border-amber-400">
            🧊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-['Noto_Sans_Malayalam']">
                dheee chechi pinnem
              </h1>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 font-['Noto_Sans_Malayalam']">
                ദേ ചേച്ചി പിന്നെയും!
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5 font-['Noto_Sans_Malayalam']">
              വീട്ടു ഫ്രിഡ്ജ് തുറക്കുമ്പോഴുള്ള രസകരമായ കോമഡി കലിപ്പുകൾ 😂
            </p>
          </div>
        </div>

        {/* Header Controls: Edit Writings button & Refrigerator Color Selector */}
        <div className="flex items-center gap-2.5">
          
          {/* Edit Fridge Writings Button in Header */}
          <button
            onClick={() => setIsEditWritingsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300/80 text-xs font-bold transition-all cursor-pointer shadow-xs font-['Noto_Sans_Malayalam']"
            title="ഫ്രിഡ്ജിലെ എഴുത്തുകൾ മാറ്റൂ"
          >
            <Pencil className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">എഴുത്തുകൾ മാറ്റൂ</span>
            <span className="sm:hidden">എഴുത്ത്</span>
          </button>

          {/* Home Fridge Color Picker */}
          <div className="flex items-center gap-1.5 bg-stone-50 p-1.5 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-xs font-bold text-stone-500 font-['Noto_Sans_Malayalam'] hidden sm:inline px-1">
              നിറം:
            </span>
            {HOME_FRIDGE_COLORS.map((c) => (
              <button
                key={c.id}
                onClick={() => setFridgeColor(c.id)}
                className={`w-7 h-7 rounded-xl border-2 transition-transform cursor-pointer flex items-center justify-center ${c.bg} ${
                  fridgeColor === c.id
                    ? 'scale-110 shadow-md ring-2 ring-amber-400 border-white'
                    : 'border-white/80 opacity-75 hover:opacity-100'
                }`}
                title={c.name}
              >
                {fridgeColor === c.id && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* Main Kitchen Content Stage */}
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 p-4 sm:p-6 relative z-10">
        
        {/* Refrigerator Centerpiece with home accessories & editable writings */}
        <section className="w-full flex flex-col items-center" id="fridge-section">
          <FridgeVisual
            isOpen={isOpen}
            onToggleDoor={handleToggleDoor}
            color={fridgeColor}
            snacks={INITIAL_SNACKS}
            activeSnackDiscovery={activeSnack}
            count={count}
            notes={notes}
            activeNoteIndex={activeNoteIndex}
            onChangeActiveNoteIndex={(idx) => {
              setActiveNoteIndex(idx);
              saveState(count, history, notes, idx, magnets);
            }}
            onOpenEditWritingsModal={() => setIsEditWritingsModalOpen(true)}
            magnets={magnets}
          />
        </section>

        {/* Primary Open/Close Button and Open Counter */}
        <div className="w-full max-w-md flex flex-col items-center gap-3">
          <button
            id="open-fridge-btn"
            onClick={handleToggleDoor}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg tracking-wide shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer font-['Noto_Sans_Malayalam'] active:scale-95 ${
              isOpen
                ? 'bg-amber-400 hover:bg-amber-500 text-stone-900 border border-amber-300'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {isOpen ? (
              <>
                <DoorClosed className="w-5 h-5 text-stone-900" />
                <span>കതക് അടയ്ക്കൂ (Close Door)</span>
              </>
            ) : (
              <>
                <DoorOpen className="w-5 h-5 text-amber-400" />
                <span>ഫ്രിഡ്ജ് തുറക്കൂ (Open Fridge)</span>
              </>
            )}
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-white/20 text-current ml-1">
              SPACE
            </span>
          </button>

          {/* Quick Counter Banner */}
          <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-amber-600 font-mono">
                {count}
              </span>
              <div className="text-left">
                <span className="text-xs font-bold text-stone-800 font-['Noto_Sans_Malayalam'] block">
                  തവണ തുറന്നു നോക്കി
                </span>
                <span className="text-[11px] text-stone-500">
                  {count === 0 ? 'തുടങ്ങാൻ ക്ലിക്ക് ചെയ്യൂ' : 'വീട്ടുകാരുടെ പ്രതികരണങ്ങൾ കാണൂ!'}
                </span>
              </div>
            </div>

            {count > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-stone-600 font-['Noto_Sans_Malayalam']">
                  {count > 15 ? '🔥 അതിക്രമം!' : count > 5 ? '⚠️ അനിയൻ കാണുന്നുണ്ട്' : '✨ സ്വാഗതം'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Malayalam Comedy Dialogue Banner */}
        <section className="w-full flex justify-center" id="dialogue-banner-section">
          <MalayalamDialogueBanner
            currentDialogue={currentDialogue}
            count={count}
            isVoiceActive={isVoiceActive}
            onToggleVoice={() => setIsVoiceActive(!isVoiceActive)}
            onSelectDialogue={(d) => setCurrentDialogue(d)}
          />
        </section>

        {/* Sound Effects & Custom Audio Settings */}
        <section className="w-full" id="sound-controls-section">
          <SoundBar
            soundProfile={soundProfile}
            onSelectProfile={setSoundProfile}
            volume={volume}
            onVolumeChange={setVolume}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            uploadedSounds={uploadedSounds}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            useCustomAudio={useCustomAudio}
            onToggleUseCustomAudio={setUseCustomAudio}
          />
        </section>

        {/* History & Kitchen Telemetry */}
        <section className="w-full pb-4" id="history-section">
          <HistoryAndStats
            count={count}
            history={history}
            onReset={handleReset}
          />
        </section>

      </main>

      {/* Cozy Kerala Home Kitchen Footer */}
      <footer className="w-full relative z-10 bg-stone-900 text-stone-300 py-4 px-6 border-t border-stone-800 text-xs">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>🏡</span>
            <span className="font-['Noto_Sans_Malayalam'] font-semibold">
              dheee chechi pinnem • നാടൻ വീട്ടു ഫ്രിഡ്ജ്
            </span>
          </div>
          <div className="text-stone-400 text-[11px] font-['Noto_Sans_Malayalam']">
            "വിശപ്പല്ലെങ്കിലും ഫ്രിഡ്ജ് തുറക്കുന്നത് നമ്മുടെ പാരമ്പര്യമാണ്!" ✨
          </div>
        </div>
      </footer>

      {/* Edit Fridge Writings Modal */}
      <EditFridgeWritingsModal
        isOpen={isEditWritingsModalOpen}
        onClose={() => setIsEditWritingsModalOpen(false)}
        notes={notes}
        activeNoteIndex={activeNoteIndex}
        onSaveNotes={handleSaveNotes}
        magnets={magnets}
        onSaveMagnets={handleSaveMagnets}
      />

      {/* Custom Audio Upload Modal */}
      <CustomAudioModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        uploadedSounds={uploadedSounds}
        onAddSounds={handleAddSounds}
        onRemoveSound={handleRemoveSound}
        onClearAll={handleClearAllSounds}
        useCustomAudio={useCustomAudio}
        onToggleUseCustomAudio={setUseCustomAudio}
      />
    </div>
  );
}
