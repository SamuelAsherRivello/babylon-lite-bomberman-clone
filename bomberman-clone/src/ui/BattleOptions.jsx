import { atlasUrl, ATLAS_COLUMNS, ATLAS_ROWS } from '../content/art.js';
import { useMemo } from 'react';
export function BattleOptions({
  options,
  onChange,
  disabled = false,
  bombFlash,
  onBombFlash,
  showChainReaction = true,
  explosionStyle = 'classic',
  onExplosionStyle,
  mode,
  onModeChange,
}) {
  return (
    <div className={`battle-options${mode ? ' battle-options-with-mode' : ''}`}>
      <h3 className="battle-options-heading">Toggles</h3>
      {mode && onModeChange && (
        <div className="toggle-button-container toggle-button-container-single battle-options-mode">
          <button
            type="button"
            aria-pressed="true"
            aria-label={`Mode: ${mode === 'offline' ? 'Offline' : 'Online'}`}
            title={
              mode === 'offline' ? 'Switch to online multiplayer.' : 'Switch to offline practice.'
            }
            onClick={onModeChange}
          >
            Mode: {mode === 'offline' ? 'Offline' : 'Online'}
          </button>
        </div>
      )}
      <div
        className={`toggle-button-container${showChainReaction ? '' : ' toggle-button-container-two'}`}
      >
        <button
          type="button"
          aria-pressed={Boolean(options.plant)}
          title="Starts a creeping plant that grows every five seconds and blocks movement. Bomb blasts cut its segments."
          disabled={disabled}
          onClick={() => onChange({ plant: !options.plant })}
        >
          Creeping Death: {options.plant ? 'On' : 'Off'}
        </button>
        {showChainReaction && (
          <button
            type="button"
            aria-pressed={Boolean(options.chainReaction)}
            title="When multiple bombs explode together, their blasts extend across the arena and can trigger more bombs."
            disabled={disabled}
            onClick={() => onChange({ chainReaction: !options.chainReaction })}
          >
            Chain Reaction: {options.chainReaction ? 'On' : 'Off'}
          </button>
        )}
        <button
          type="button"
          aria-pressed={Boolean(bombFlash)}
          title="Makes bombs flash twice just before they explode. This visual setting does not change their timing."
          onClick={() => onBombFlash(!bombFlash)}
        >
          Bomb Flash: {bombFlash ? 'On' : 'Off'}
        </button>
        <button
          type="button"
          aria-pressed={explosionStyle === 'pfx'}
          title="Classic keeps the original blast art. PFX previews the blast path with looping smoke and one-shot fire."
          disabled={disabled}
          onClick={() => onExplosionStyle?.(explosionStyle === 'pfx' ? 'classic' : 'pfx')}
        >
          Explosion: {explosionStyle === 'pfx' ? 'PFX' : 'Classic'}
        </button>
      </div>
      <h3 className="battle-options-heading">Dropdowns</h3>
      <div className="battle-options-selects">
        <label>
          MAP SIZE:{' '}
          <select
            aria-label="Map size"
            title="Sets the arena size: Low is smallest, Med is larger, and High is largest."
            value={options.map}
            disabled={disabled}
            onChange={(e) => onChange({ map: e.target.value })}
          >
            {['LOW', 'MED', 'HIGH'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
        <label>
          CPU DIFFICULTY:{' '}
          <select
            aria-label="CPU difficulty"
            title="Sets how smart the computer-controlled players are: Low, Med, or Hard."
            value={options.cpu}
            disabled={disabled}
            onChange={(e) => onChange({ cpu: e.target.value })}
          >
            {['LOW', 'MED', 'HARD'].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
export function PowerupLegend() {
  const url = useMemo(() => atlasUrl(), []);
  return (
    <div className="powerup-legend" aria-label="Power-up meanings">
      {[
        [10, 'Bomb', 'One extra bomb; maximum five'],
        [11, 'Range', 'Longer blast; maximum eight'],
        [12, 'Speed', '15% faster; maximum three'],
        [5, 'Glove', 'Push bombs until they hit an obstacle; lasts this life'],
        [6, 'Lightning', 'Invulnerable for ten seconds'],
      ].map(([frame, name, meaning]) => (
        <div key={name}>
          <span
            className="pickup-icon"
            style={{
              backgroundImage: `url(${url})`,
              backgroundSize: `${ATLAS_COLUMNS * 24}px ${ATLAS_ROWS * 24}px`,
              backgroundPosition: `-${(frame % ATLAS_COLUMNS) * 24}px -${Math.floor(frame / ATLAS_COLUMNS) * 24}px`,
            }}
          />
          <span>
            <strong>{name}</strong> <span className="pickup-meaning">{meaning}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
