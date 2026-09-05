import React from 'react';
import { Volume2, VolumeX, Sparkles, UploadCloud, Play, Radio, Music } from 'lucide-react';
import { SoundProfile, UploadedAudio } from '../types';
import { SoundEngine } from '../utils/audio';

interface SoundBarProps {
  soundProfile: SoundProfile;
  onSelectProfile: (profile: SoundProfile) => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  uploadedSounds: UploadedAudio[];
  onOpenUploadModal: () => void;
  useCustomAudio: boolean;
  onToggleUseCustomAudio: (val: boolean) => void;
}

const PROFILES: { id: SoundProfile; label: string; malayalamLabel: string; icon: string; desc: string }[] = [
  { id: 'realistic', label: 'Home Gasket', malayalamLabel: 'നാടൻ ഫ്രിഡ്ജ്', icon: '🧊', desc: 'തനി നാടൻ വാക്വം സീലും മാഗ്നറ്റിക് ലോക്കും' },
  { id: 'cartoon', label: 'Cartoon Boing', malayalamLabel: 'കോമഡി ബോയിങ്', icon: '🤪', desc: 'തമാശ സ്പ്രിങ് ഒച്ചയും ശബ്ദങ്ങളും' },
  { id: 'retro', label: 'Old Radio', malayalamLabel: 'പഴയ റേഡിയോ', icon: '📻', desc: '80കളിലെ ഗൃഹാതുരമായ റേഡിയോ ചിം' },
  { id: 'scifi', label: 'Frost Vapor', malayalamLabel: 'ഡീപ് ഫ്രീസ്', icon: '❄️', desc: 'തണുത്ത ഐസ് കാറ്റും എയർ റിലീസും' },
  { id: 'asmr', label: 'ASMR Chill', malayalamLabel: 'സോഫ്റ്റ് ക്ലിക്ക്', icon: '🎧', desc: 'ശാന്തമായ തണുപ്പും മൃദുവായ ഒച്ചയും' },
];

export const SoundBar: React.FC<SoundBarProps> = ({
  soundProfile,
  onSelectProfile,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  uploadedSounds,
  onOpenUploadModal,
  useCustomAudio,
  onToggleUseCustomAudio,
}) => {
  const handleTestSound = () => {
    if (useCustomAudio && uploadedSounds.length > 0) {
      const randomSound = uploadedSounds[Math.floor(Math.random() * uploadedSounds.length)];
      const audio = new Audio(randomSound.url);
      audio.volume = isMuted ? 0 : volume;
      audio.play().catch(() => {});
    } else {
      SoundEngine.playDoorOpen(soundProfile);
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-stone-200 shadow-xl p-5 text-stone-800 space-y-4">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shadow-xs">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-stone-900 font-['Noto_Sans_Malayalam']">
                ഫ്രിഡ്ജ് ശബ്ദ ഇഫക്റ്റുകൾ (Sound FX)
              </span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                റിയലിസ്റ്റിക്
              </span>
            </div>
            <p className="text-xs text-stone-500">
              {useCustomAudio && uploadedSounds.length > 0
                ? `നിങ്ങളുടെ കസ്റ്റം സൗണ്ടുകൾ ആക്ടീവാണ് (${uploadedSounds.length} എണ്ണം)`
                : PROFILES.find(p => p.id === soundProfile)?.desc}
            </p>
          </div>
        </div>

        {/* Action Buttons: Test Sound & Custom FX */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200/80 shadow-xs cursor-pointer transition-all"
            title="ശബ്ദം കേട്ടു നോക്കൂ"
          >
            <Play className="w-3.5 h-3.5 fill-amber-800 text-amber-800" />
            <span className="font-['Noto_Sans_Malayalam']">കേൾക്കൂ</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 shadow-xs cursor-pointer transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5 text-stone-600" />
            <span>സ്വന്തം ഓഡിയോ</span>
            {uploadedSounds.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-400 text-stone-950 rounded-full text-[10px] font-bold">
                {uploadedSounds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sound Profiles Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {PROFILES.map((profile) => {
          const isSelected = soundProfile === profile.id && !useCustomAudio;
          return (
            <button
              key={profile.id}
              onClick={() => {
                onToggleUseCustomAudio(false);
                onSelectProfile(profile.id);
                SoundEngine.playDoorOpen(profile.id);
              }}
              className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-100/90 border-amber-300 shadow-sm ring-2 ring-amber-300/40'
                  : 'bg-stone-50/70 hover:bg-stone-100 border-stone-200/80 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{profile.icon}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                )}
              </div>
              <div className="mt-2">
                <span className="text-xs font-bold block text-stone-900 font-['Noto_Sans_Malayalam']">
                  {profile.malayalamLabel}
                </span>
                <span className="text-[10px] text-stone-500 font-medium block">
                  {profile.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volume Slider & Mute Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer text-stone-700"
            title={isMuted ? 'ശബ്ദം ഓൺ ചെയ്യൂ' : 'ശബ്ദം മ്യൂട്ട് ചെയ്യൂ'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-amber-700" />
            )}
          </button>
          <span className="font-medium font-['Noto_Sans_Malayalam']">
            {isMuted ? 'മ്യൂട്ടാണ്' : `ശബ്ദ നില: ${Math.round(volume * 100)}%`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-24 sm:w-32 accent-amber-600 cursor-pointer"
          />
        </div>
      </div>

    </div>
  );
};
