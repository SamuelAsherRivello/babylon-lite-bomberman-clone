import { useEffect, useRef, useState } from 'react';
import { createGame, stepGame, STEP } from './game/rules.js';
import { createGameRenderer } from './content/renderer.js';
import { createControls, createGestureHandlers } from './input/controls.js';
import versionText from '../../version.txt?raw';
import { Online } from './Online.jsx';
import { Viewport } from './ui/Viewport.jsx';
import { ArenaPlayers } from './ui/ArenaPlayers.jsx';
import { TopNav } from './ui/TopNav.jsx';
import { AudioSettings, useArcadeAudio } from './ui/AudioSettings.jsx';
import { cpuInput } from './game/cpu.js';
import { BattleOptions, PowerupLegend } from './ui/BattleOptions.jsx';
import { DeathView } from './game/death-view.js';
import {
  DEFAULT_BATTLE_OPTIONS,
  clearLocalStorage,
  loadBattleOptions,
  loadBombFlash,
  saveBattleOptions,
  saveBombFlash,
} from './ui/preferences.js';

const PRACTICE_PLAYERS = [
  { color: 0, name: 'Mint', cpu: false },
  { color: 1, name: 'Amber', cpu: true },
  { color: 2, name: 'Violet', cpu: true },
  { color: 3, name: 'Rose', cpu: true },
];

export function App() {
  const [online, setOnline] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('room') || params.get('mode') !== 'offline';
  });
  const [coarsePointer, setCoarsePointer] = useState(() => matchMedia('(pointer: coarse)').matches);
  const [aspectOverride, setAspectOverride] = useState(null);
  useEffect(() => {
    const pointer = matchMedia('(pointer: coarse)');
    const update = () => setCoarsePointer(pointer.matches);
    pointer.addEventListener('change', update);
    return () => pointer.removeEventListener('change', update);
  }, []);
  const aspect = aspectOverride ?? (coarsePointer ? 'portrait' : 'landscape');
  const toggleAspect = () => setAspectOverride(aspect === 'landscape' ? 'portrait' : 'landscape');
  return online ? (
    <Online aspect={aspect} onExit={() => setOnline(false)} onAspectChange={toggleAspect} />
  ) : (
    <Practice aspect={aspect} onOnline={() => setOnline(true)} onAspectChange={toggleAspect} />
  );
}
function Practice({ aspect, onOnline, onAspectChange }) {
  const sound = useArcadeAudio();
  const [options, setOptions] = useState(loadBattleOptions),
    optionRef = useRef(options),
    brains = useRef(new Map()),
    death = useRef(new DeathView());
  const [frozen, setFrozen] = useState(false),
    [bombFlash, setBombFlash] = useState(loadBombFlash),
    flash = useRef(bombFlash);
  const changeFlash = (value) => {
    flash.current = value;
    setBombFlash(value);
    saveBombFlash(value);
  };
  const canvas = useRef(null),
    game = useRef(
      createGame(
        ['practice', 'cpu:1', 'cpu:2', 'cpu:3'],
        1,
        options.map,
        options.plant,
        options.chainReaction,
      ),
    ),
    controls = useRef(null),
    gestures = useRef(null);
  if (!gestures.current) gestures.current = createGestureHandlers(controls);
  const [message, setMessage] = useState('Starting Babylon Lite…'),
    [paused, setPaused] = useState(false),
    [alive, setAlive] = useState(true),
    [settings, setSettings] = useState(false),
    [clearMessage, setClearMessage] = useState(''),
    [stats, setStats] = useState('1 BOMB · RANGE 2 · SPEED 0');
  useEffect(() => {
    let cancelled = false,
      renderer,
      frame,
      last = 0,
      accumulator = 0;
    const input = createControls();
    controls.current = input;
    const loop = (now) => {
      if (cancelled) return;
      accumulator += Math.min((now - last) / 1000, 0.1);
      last = now;
      while (accumulator >= STEP) {
        if (!death.current.frozen(now)) {
          const commands = { practice: input.read() };
          for (const p of game.current.players.slice(1))
            commands[p.id] = cpuInput(game.current, p.id, brains.current, optionRef.current.cpu);
          stepGame(game.current, commands);
        }
        accumulator -= STEP;
      }
      const shown = death.current.draw(game.current, 'practice', now);
      shown.bombFlash = flash.current;
      setFrozen(death.current.frozen(now));
      const mapping = renderer.draw(shown);
      sound.audio.current?.observe(game.current);
      setAlive(game.current.players[0].alive);
      setStats(
        `${game.current.players[0].capacity} BOMB · RANGE ${game.current.players[0].range} · SPEED ${game.current.players[0].speedLevel}`,
      );
      frame = requestAnimationFrame(loop);
    };
    createGameRenderer(canvas.current)
      .then((r) => {
        renderer = r;
        if (cancelled) {
          r.dispose();
          return;
        }
        setMessage('');
        last = performance.now();
        frame = requestAnimationFrame(loop);
      })
      .catch((error) => {
        if (!cancelled) setMessage(error.message);
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      input.dispose();
      gestures.current?.dispose();
      renderer?.dispose();
      controls.current = null;
    };
  }, []);
  const pause = (value) => {
    game.current.paused = value;
    controls.current?.clear();
    setPaused(value);
  };
  const restart = () => {
    controls.current?.clear();
    game.current = createGame(
      ['practice', 'cpu:1', 'cpu:2', 'cpu:3'],
      1,
      optionRef.current.map,
      optionRef.current.plant,
      optionRef.current.chainReaction,
    );
    brains.current.clear();
    death.current.reset();
    setFrozen(false);
    setPaused(false);
    setAlive(true);
    setSettings(false);
  };
  const clearSettings = () => {
    clearLocalStorage();
    const defaults = { ...DEFAULT_BATTLE_OPTIONS };
    optionRef.current = defaults;
    setOptions(defaults);
    flash.current = true;
    setBombFlash(true);
    restart();
    pause(true);
    setSettings(true);
    setClearMessage('Local storage cleared.');
  };
  const toggleSettings = () => {
    setClearMessage('');
    setSettings(!settings);
    pause(!settings);
  };
  return (
    <Viewport aspect={aspect}>
      <div
        className="game-layout"
        style={{
          '--arena-columns': game.current.width,
          '--arena-rows': game.current.height,
        }}
      >
        <div className="arena-slot">
          <ArenaPlayers
            players={PRACTICE_PLAYERS}
            canvas={canvas}
            gestures={gestures.current}
            arenaLabel="Bomberman practice arena"
            mapWidth={game.current.width}
            mapHeight={game.current.height}
            localPlayerColor={0}
          />
        </div>
        <section
          className="game-panel practice-game-panel"
          data-information-panel
          {...gestures.current.panel}
        >
          <header className="panel-header">
            <header className="corner corner_top_left">
              <h1>Bomberman Clone</h1>
            </header>
            <TopNav
              online={false}
              aspect={aspect}
              onModeChange={onOnline}
              onAspectChange={onAspectChange}
            />
          </header>
          <div className="panel-content">
            <div className="hud">
              <span className={alive ? 'live' : 'out'}>
                {alive ? '● READY TO BLAST' : '● ELIMINATED'}
              </span>
              <span>{stats}</span>
            </div>
            <aside className="legend-rail">
              <BattleOptions
                options={options}
                onChange={(patch) => {
                  const next = { ...optionRef.current, ...patch };
                  optionRef.current = next;
                  setOptions(next);
                  saveBattleOptions(next);
                  setClearMessage('');
                  restart();
                }}
                bombFlash={bombFlash}
                onBombFlash={changeFlash}
              />
              <PowerupLegend />
            </aside>
            <div className="instructions">
              MOVE <kbd>WASD</kbd> / <kbd>↑↓←→</kbd> · BOMB <kbd>SPACE</kbd>
              <span>Place. Escape. Repeat.</span>
            </div>
          </div>
          <footer className="panel-footer">
            <section className="corner corner_bottom_left">
              <button onClick={toggleSettings}>⚙ Settings</button>
            </section>
            <div className="corner corner_bottom_right">
              v{versionText.trim().replace(/^version=/, '')}
              <span>LOCAL PRACTICE</span>
            </div>
          </footer>
          {settings && (
            <div className="overlay settings-overlay">
              <div className="settings-content">
                <h2>Settings</h2>
                <AudioSettings sound={sound} />
                <button
                  onClick={() => {
                    const operation = document.fullscreenElement
                      ? document.exitFullscreen()
                      : document.documentElement.requestFullscreen();
                    operation?.catch(() =>
                      setMessage('Fullscreen is unavailable in this browser.'),
                    );
                  }}
                >
                  Fullscreen
                </button>
                <button onClick={restart}>Restart practice</button>
                <button onClick={clearSettings}>Clear Local Storage</button>
                {clearMessage && <p role="status">{clearMessage}</p>}
                <button onClick={toggleSettings}>Resume</button>
              </div>
            </div>
          )}
          {message && (
            <div className="overlay" role="status">
              <h2>Getting ready</h2>
              <p>{message}</p>
              {message !== 'Starting Babylon Lite…' && (
                <button onClick={() => location.reload()}>Try graphics again</button>
              )}
            </div>
          )}
          {!message && !alive && !frozen && (
            <div className="overlay">
              <span className="eyebrow">CAUGHT IN THE CROSSFIRE</span>
              <h2>One more round?</h2>
              <p>Escape before your bomb explodes.</p>
              <button onClick={restart}>Try again ↗</button>
            </div>
          )}
          {!message && paused && alive && !settings && (
            <div className="overlay">
              <h2>Take a breather</h2>
              <button
                onClick={() => {
                  setSettings(false);
                  pause(false);
                }}
              >
                Resume
              </button>
            </div>
          )}
        </section>
      </div>
    </Viewport>
  );
}
