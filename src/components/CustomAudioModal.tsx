import React, { useRef, useState } from 'react';
import { X, UploadCloud, Play, Trash2, Music, Check, Volume2, AlertCircle } from 'lucide-react';
import { UploadedAudio } from '../types';

interface CustomAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedSounds: UploadedAudio[];
  onAddSounds: (files: File[]) => void;
  onRemoveSound: (id: string) => void;
  onClearAll: () => void;
  useCustomAudio: boolean;
  onToggleUseCustomAudio: (val: boolean) => void;
}

export const CustomAudioModal: React.FC<CustomAudioModalProps> = ({
  isOpen,
  onClose,
  uploadedSounds,
  onAddSounds,
  onRemoveSound,
  onClearAll,
  useCustomAudio,
  onToggleUseCustomAudio,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const audioFiles = (Array.from(e.dataTransfer.files) as File[]).filter(f => f.type.startsWith('audio/'));
      if (audioFiles.length > 0) {
        onAddSounds(audioFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const audioFiles = (Array.from(e.target.files) as File[]).filter(f => f.type.startsWith('audio/'));
      if (audioFiles.length > 0) {
        onAddSounds(audioFiles);
      }
      e.target.value = '';
    }
  };

  const handlePlayPreview = (sound: UploadedAudio) => {
    setPlayingId(sound.id);
    const audio = new Audio(sound.url);
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().catch(() => setPlayingId(null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-stone-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-amber-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200/80 border border-amber-300 text-amber-900 flex items-center justify-center shadow-xs">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-['Noto_Sans_Malayalam']">
                സ്വന്തം ശബ്ദങ്ങൾ ചേർക്കൂ (Custom Audio)
              </h3>
              <p className="text-xs text-stone-500">
                ഓഡിയോ ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യാം (.mp3, .wav, .m4a, .ogg)
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-500 bg-amber-50/60'
                : 'border-stone-300 bg-stone-50/70 hover:bg-stone-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="audio/*"
              multiple
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 mx-auto flex items-center justify-center mb-3 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-stone-800 font-['Noto_Sans_Malayalam']">
              ഓഡിയോ ഫയൽ ഇവിടെ വലിച്ചിടുക അല്ലെങ്കിൽ ക്ലിക്ക് ചെയ്യുക
            </p>
            <p className="text-xs text-stone-500 mt-1">
              MP3, WAV, OGG, M4A സപ്പോർട്ട് ചെയ്യുന്നു. ഫ്രിഡ്ജ് തുറക്കുമ്പോൾ ഇവ കേൾക്കാം!
            </p>
          </div>

          {/* Toggle Priority for Uploaded Sounds */}
          {uploadedSounds.length > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
              <div>
                <span className="text-xs font-bold text-amber-950 block font-['Noto_Sans_Malayalam']">
                  ഫ്രിഡ്ജ് തുറക്കുമ്പോൾ കസ്റ്റം ഓഡിയോ പ്ലേ ചെയ്യുക
                </span>
                <span className="text-[11px] text-amber-800">
                  ഓണാണെങ്കിൽ നിങ്ങളിട്ട ഓഡിയോ കേൾക്കാം
                </span>
              </div>
              <button
                onClick={() => onToggleUseCustomAudio(!useCustomAudio)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors cursor-pointer ${
                  useCustomAudio ? 'bg-amber-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                    useCustomAudio ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Uploaded Audio List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 font-['Noto_Sans_Malayalam']">
                ചേർത്ത ശബ്ദങ്ങൾ ({uploadedSounds.length})
              </span>
              {uploadedSounds.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  എല്ലാം കളയുക
                </button>
              )}
            </div>

            {uploadedSounds.length === 0 ? (
              <div className="text-center py-6 rounded-2xl bg-stone-50 border border-stone-200 text-stone-500 text-xs font-medium font-['Noto_Sans_Malayalam']">
                ഇതുവരെ കസ്റ്റം ശബ്ദങ്ങൾ ചേർത്തിട്ടില്ല. നാടൻ ശബ്ദങ്ങൾ ഡിഫോൾട്ടായി കേൾക്കാം.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {uploadedSounds.map((sound, idx) => (
                  <div
                    key={sound.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="text-xs font-bold text-stone-800 truncate">
                          {sound.name}
                        </p>
                        <p className="text-[10px] text-stone-500">{sound.size}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handlePlayPreview(sound)}
                        className={`p-2 rounded-lg cursor-pointer transition-colors ${
                          playingId === sound.id
                            ? 'bg-amber-400 text-stone-900'
                            : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
                        }`}
                        title="ശബ്ദം കേൾക്കൂ"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => onRemoveSound(sound.id)}
                        className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ഒഴിവാക്കൂ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-stone-400" />
            ബ്രൗസറിൽ മാത്രം സൂക്ഷിക്കുന്നു
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            പൂർത്തിയായി
          </button>
        </div>
      </div>
    </div>
  );
};
