import { useEffect, useRef, useState } from 'react';
import { ArcadeAudio } from '../content/audio.js';
import {
  DEFAULT_AUDIO_PREFERENCES,
  loadAudioPreferences,
  saveAudioPreferences,
} from './preferences.js';

export function useArcadeAudio() {
  const audio = useRef(null);
  const forced = new URLSearchParams(location.search).get('mute') === '1';
  const [audioPreferences, setAudioPreferences] = useState(loadAudioPreferences);
  const muted = forced || audioPreferences.muted;
  const volume = audioPreferences.volume;
  const setMuted = (value) => setAudioPreferences((current) => ({ ...current, muted: value }));
  const setVolume = (value) => setAudioPreferences((current) => ({ ...current, volume: value }));
  useEffect(() => {
    saveAudioPreferences(audioPreferences);
  }, [audioPreferences]);
  useEffect(() => {
    const engine = new ArcadeAudio();
    audio.current = engine;
    return () => {
      engine.dispose();
      audio.current = null;
    };
  }, []);
  useEffect(() => {
    audio.current?.set(muted, volume);
  }, [muted, volume]);
  const reset = () => setAudioPreferences({ ...DEFAULT_AUDIO_PREFERENCES });
  return { audio, muted, setMuted, volume, setVolume, reset };
}
export function AudioSettings({ sound }) {
  const forced = new URLSearchParams(location.search).get('mute') === '1';
  return (
    <div className="audio-settings">
      <label>
        Volume{' '}
        <input
          aria-label="Audio volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={sound.volume}
          onChange={(e) => sound.setVolume(Number(e.target.value))}
        />
      </label>
      <button
        type="button"
        className="audio-mute-toggle"
        aria-pressed={sound.muted}
        disabled={forced}
        title="Mutes or enables all arcade audio."
        onClick={() => sound.setMuted(!sound.muted)}
      >
        Mute All Audio: {sound.muted ? 'On' : 'Off'}
      </button>
      {forced && <p>Silent testing: mute=1 is active.</p>}
    </div>
  );
}
