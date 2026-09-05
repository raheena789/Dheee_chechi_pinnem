import { FridgeSnack } from '../types';

export const INITIAL_SNACKS: FridgeSnack[] = [
  {
    id: 'payasam',
    name: 'അടപ്രഥമൻ (Ada Pradhaman)',
    icon: '🍲',
    shelf: 'top',
    comment: 'Leftover sweet golden payasam in a steel bowl. Chechi’s prime target!',
    rarity: 'rare'
  },
  {
    id: 'milk',
    name: 'മിൽമ പാൽ (Milma Milk)',
    icon: '🥛',
    shelf: 'top',
    comment: 'Kept chilled right next to the yogurt bowl. "Don’t drink before tea!"',
    rarity: 'common'
  },
  {
    id: 'chocolate',
    name: 'ഒളിപ്പിച്ച ചോക്ലേറ്റ് (Hidden Chocolate)',
    icon: '🍫',
    shelf: 'top',
    comment: 'Expertly concealed behind the curry dabba so younger brother won’t see!',
    rarity: 'rare'
  },
  {
    id: 'biryani',
    name: 'തലശ്ശേരി ബിരിയാണി (Leftover Biryani)',
    icon: '🍱',
    shelf: 'middle',
    comment: 'Heated up with ghee, midnight biryani hits different!',
    rarity: 'common'
  },
  {
    id: 'achar',
    name: 'മാങ്ങാ അച്ചാർ (Mango Pickle Jar)',
    icon: '🏺',
    shelf: 'middle',
    comment: 'Homemade Bharani pickle jar. Spicy, tangy, and dangerously good.',
    rarity: 'common'
  },
  {
    id: 'fish_curry',
    name: 'കുടംപുളി മീൻ കറി (Fish Curry Bowl)',
    icon: '🥘',
    shelf: 'middle',
    comment: 'Scientifically proven to taste 10x richer the morning after.',
    rarity: 'common'
  },
  {
    id: 'mango',
    name: 'മൂവാണ്ടൻ മാങ്ങ (Ripe Mangoes)',
    icon: '🥭',
    shelf: 'bottom',
    comment: 'Sweet, chilled Kerala mangoes in the lower crisper drawer.',
    rarity: 'common'
  },
  {
    id: 'banana',
    name: 'ഏത്തപ്പഴം (Ripe Bananas)',
    icon: '🍌',
    shelf: 'bottom',
    comment: 'Ready for Pazham Pori or a quick grab-and-go snack.',
    rarity: 'common'
  },
  {
    id: 'lime',
    name: 'നാരങ്ങാ വെള്ളം (Chilled Naranga)',
    icon: '🥤',
    shelf: 'door',
    comment: 'Icy cold homemade lemon water with a pinch of salt.',
    rarity: 'common'
  },
  {
    id: 'coconut',
    name: 'കരിക്കിൻ വെള്ളം (Tender Coconut)',
    icon: '🥥',
    shelf: 'door',
    comment: 'Sweet tender coconut water fresh from the local coconut palm.',
    rarity: 'common'
  },
  {
    id: 'golden_halwa',
    name: 'സ്വർണ്ണ കോഴിക്കോടൻ ഹൽവ (Golden Kozhikodan Halwa)',
    icon: '✨🧈',
    shelf: 'middle',
    comment: 'A celestial black & ghee Kozhikodan Halwa glowing with perfection!',
    rarity: 'legendary'
  }
];

export const FUN_MESSAGES = [
  { count: 0, title: 'Sealed & Chilling', text: 'The fridge is quiet, humming at a frosty 3.4°C. Waiting for a visitor...' },
  { count: 1, title: 'First Visit', text: 'First check of the day! Taking a hopeful scan of the inventory.' },
  { count: 2, title: 'Already Back?', text: 'Checking again? New groceries have not spontaneously materialized.' },
  { count: 3, title: 'Lowering Standards', text: 'Nothing changed, yet somehow the leftover condiments look tempting now.' },
  { count: 4, title: 'The Stare', text: 'You’re staring into the vegetable crisper hoping for a fresh burrito.' },
  { count: 5, title: '5 Visits Reached', text: 'Congratulations! You are officially using the fridge door as personal air conditioning.' },
  { count: 7, title: 'Sensory Check', text: 'Opening it for the 7th time just to hear the suction seal pop.' },
  { count: 10, title: 'Double Digits!', text: '10 OPENS! What mystery gourmet feast are you searching for?!' },
  { count: 14, title: 'Refrigerator Philosopher', text: 'Standing in the kitchen illuminated purely by the 15W interior bulb.' },
  { count: 20, title: 'Restraining Order', text: 'The fridge compressor has filed an emotional distress complaint.' },
  { count: 30, title: 'Absolute Legend', text: '30 openings! You have unlocked eternal kinship with the midnight snack spirits.' }
];

export function getMessageForCount(count: number): { title: string; text: string } {
  if (count === 0) return FUN_MESSAGES[0];
  
  // Find highest threshold <= count
  let match = FUN_MESSAGES[1];
  for (const m of FUN_MESSAGES) {
    if (count >= m.count) {
      match = m;
    }
  }
  return match;
}
