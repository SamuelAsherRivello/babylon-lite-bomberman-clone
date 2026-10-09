export const DEFAULT_BATTLE_OPTIONS = {
  cpu: 'MED',
  map: 'LOW',
  plant: false,
  chainReaction: false,
};

const BATTLE_OPTIONS_KEY = 'bomberman-battle-options';
const BOMB_FLASH_KEY = 'bomberman-bomb-flash';

export function loadBattleOptions() {
  try {
    const saved = JSON.parse(localStorage.getItem(BATTLE_OPTIONS_KEY));
    return {
      cpu: ['LOW', 'MED', 'HARD'].includes(saved?.cpu) ? saved.cpu : DEFAULT_BATTLE_OPTIONS.cpu,
      map: ['LOW', 'MED', 'HIGH'].includes(saved?.map) ? saved.map : DEFAULT_BATTLE_OPTIONS.map,
      plant: typeof saved?.plant === 'boolean' ? saved.plant : DEFAULT_BATTLE_OPTIONS.plant,
      chainReaction:
        typeof saved?.chainReaction === 'boolean'
          ? saved.chainReaction
          : DEFAULT_BATTLE_OPTIONS.chainReaction,
    };
  } catch {
    return { ...DEFAULT_BATTLE_OPTIONS };
  }
}

export function saveBattleOptions(options) {
  localStorage.setItem(BATTLE_OPTIONS_KEY, JSON.stringify(options));
}

export function loadBombFlash() {
  return localStorage.getItem(BOMB_FLASH_KEY) !== 'off';
}

export function saveBombFlash(value) {
  localStorage.setItem(BOMB_FLASH_KEY, value ? 'on' : 'off');
}

export function clearLocalStorage() {
  localStorage.clear();
}
