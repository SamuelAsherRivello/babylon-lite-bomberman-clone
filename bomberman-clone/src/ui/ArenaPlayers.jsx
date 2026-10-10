import { actorSpriteUrl } from '../content/art.js';

const DOOR_ART = `${import.meta.env.BASE_URL}assets/door-half.png`;

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
  transitionState = null,
}) {
  const transition = transitionState ?? {
    parent: 'game-world',
    type: 'screen-door',
    phase: 'idle',
    easedProgress: 1,
  };
  const doorProgress = Math.max(0, Math.min(1, transition.easedProgress ?? 1));
  const leftTransform =
    transition.phase === 'opening'
      ? `translateX(${-100 * doorProgress}%)`
      : `translateX(${-100 + 100 * doorProgress}%)`;
  const rightTransform =
    transition.phase === 'opening'
      ? `translateX(${100 * doorProgress}%)`
      : `translateX(${100 - 100 * doorProgress}%)`;
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
      <div
        className="screen-transition"
        data-parent={transition.parent}
        data-type={transition.type}
        data-phase={transition.phase}
        style={{ '--screen-door-art': `url("${DOOR_ART}")` }}
        aria-hidden="true"
      >
        <div className="screen-door screen-door-left" style={{ transform: leftTransform }} />
        <div className="screen-door screen-door-right" style={{ transform: rightTransform }} />
      </div>
      <div className="arena-label-row">
        {label(CORNER_COLORS[2], 3)}
        {label(CORNER_COLORS[3], 4)}
      </div>
    </div>
  );
}
