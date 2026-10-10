export const DEFAULT_BATTLE_OPTIONS = {
  cpu: 'MED',
  map: 'LOW',
  plant: false,
  chainReaction: false,
};

const BATTLE_OPTIONS_KEY = 'bomberman-battle-options';
const BOMB_FLASH_KEY = 'bomberman-bomb-flash';
const EXPLOSION_STYLE_KEY = 'bomberman-explosion-style';
const ONLINE_MODE_KEY = 'bomberman-online-mode';
const ASPECT_KEY = 'bomberman-aspect';
const AUDIO_KEY = 'bomberman-audio';

export const DEFAULT_AUDIO_PREFERENCES = {
  muted: false,
  volume: 0.25,
};

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

export function loadExplosionStyle() {
  return localStorage.getItem(EXPLOSION_STYLE_KEY) === 'pfx' ? 'pfx' : 'classic';
}

export function saveExplosionStyle(value) {
  localStorage.setItem(EXPLOSION_STYLE_KEY, value === 'pfx' ? 'pfx' : 'classic');
}

export function loadOnlineMode() {
  return localStorage.getItem(ONLINE_MODE_KEY) !== 'offline';
}

export function saveOnlineMode(value) {
  localStorage.setItem(ONLINE_MODE_KEY, value ? 'online' : 'offline');
}

export function loadAspect() {
  const value = localStorage.getItem(ASPECT_KEY);
  return value === 'landscape' || value === 'portrait' ? value : null;
}

export function saveAspect(value) {
  if (value === 'landscape' || value === 'portrait') localStorage.setItem(ASPECT_KEY, value);
}

export function loadAudioPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(AUDIO_KEY));
    return {
      muted: typeof saved?.muted === 'boolean' ? saved.muted : DEFAULT_AUDIO_PREFERENCES.muted,
      volume:
        typeof saved?.volume === 'number' && saved.volume >= 0 && saved.volume <= 1
          ? saved.volume
          : DEFAULT_AUDIO_PREFERENCES.volume,
    };
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
}

export function saveAudioPreferences(preferences) {
  localStorage.setItem(
    AUDIO_KEY,
    JSON.stringify({
      muted: Boolean(preferences.muted),
      volume:
        typeof preferences.volume === 'number' && preferences.volume >= 0 && preferences.volume <= 1
          ? preferences.volume
          : DEFAULT_AUDIO_PREFERENCES.volume,
    }),
  );
}

export function clearLocalStorage() {
  localStorage.clear();
}
