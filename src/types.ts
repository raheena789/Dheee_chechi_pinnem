export type SoundProfile = 'realistic' | 'cartoon' | 'retro' | 'scifi' | 'asmr';

export type FridgeColor = 'maroon' | 'steel' | 'cream' | 'mint' | 'sapphire';

export interface MalayalamDialogue {
  id: string;
  minCount: number;
  malayalam: string;
  transliteration: string;
  englishMeaning: string;
  character: string;
  avatar: string;
  audioStinger?: 'boing' | 'drama' | 'whistle' | 'chime' | 'alarm';
}

export interface OpeningLog {
  id: string;
  count: number;
  timestamp: number;
  formattedTime: string;
  timeSinceLast?: string;
  snackDiscovered?: string;
  soundPlayed?: string;
  dialogue?: MalayalamDialogue;
}

export interface UploadedAudio {
  id: string;
  name: string;
  url: string;
  size: string;
}

export interface FridgeSnack {
  id: string;
  name: string;
  icon: string;
  shelf: 'top' | 'middle' | 'bottom' | 'door';
  comment: string;
  rarity?: 'common' | 'rare' | 'legendary';
}

export interface FridgeNote {
  id: string;
  text: string;
  sub: string;
  color: string;
  pinEmoji?: string;
}

export interface FridgeMagnet {
  id: string;
  emoji: string;
  label: string;
}

