import { useEffect, useRef, useState } from 'react';
import { ArcadeAudio } from '../content/audio.js';

export function useArcadeAudio() {
  const audio = useRef(null);
  const [muted, setMuted] = useState(
    () => new URLSearchParams(location.search).get('mute') === '1',
  );
  const [volume, setVolume] = useState(0.25);
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
  return { audio, muted, setMuted, volume, setVolume };
}
export function AudioSettings({ sound }) {
  const forced = new URLSearchParams(location.search).get('mute') === '1';
  return (
    <div className="audio-settings">
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
      {forced && <p>Silent testing: mute=1 is active.</p>}
    </div>
  );
}
