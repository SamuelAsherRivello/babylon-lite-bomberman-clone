import { actorSpriteUrl } from '../content/art.js';

// Match the visible arena corners: mint, violet, rose, amber.
const CORNER_COLORS = [0, 2, 3, 1];

export function ArenaPlayers({
  players,
  canvas,
  gestures,
  arenaLabel,
  mapWidth = 15,
  mapHeight = 13,
  localPlayerColor = null,
}) {
  const label = (color, position) => {
    const player = players?.find((entry) => entry.color === color);
    const localHuman = player && !player.cpu && player.color === localPlayerColor;
    const text = `${position} ${player?.name || `Player ${position}`} (${player ? (player.cpu ? 'CPU' : 'Human') : 'Open'})`;
    return (
      <div
        className={`player-label${localHuman ? ' player-label-local' : ''}`}
        key={color}
        title={text}
      >
        <img src={actorSpriteUrl(color)} alt="" />
        <span>{text}</span>
      </div>
    );
  };

  return (
    <div className="arena-stage" style={{ '--board-columns': mapWidth, '--board-rows': mapHeight }}>
      <div className="arena-label-row">
        {label(CORNER_COLORS[0], 1)}
        {label(CORNER_COLORS[1], 2)}
      </div>
      <div className="arena-square" data-render-area {...gestures.arena}>
        <canvas ref={canvas} aria-label={arenaLabel} />
      </div>
      <div className="arena-label-row">
        {label(CORNER_COLORS[2], 3)}
        {label(CORNER_COLORS[3], 4)}
      </div>
    </div>
  );
}
