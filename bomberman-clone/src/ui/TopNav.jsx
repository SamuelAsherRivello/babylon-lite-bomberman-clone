const GITHUB_URL = 'https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone';

export function TopNav({ online, aspect, onModeChange, onAspectChange }) {
  const mode = online ? 'Online' : 'Offline';
  const aspectName = aspect === 'landscape' ? 'Landscape' : 'Portrait';
  return (
    <nav className="corner corner_top_right" aria-label="Game navigation">
      <button className="nav-control" aria-label={`Mode: ${mode}`} onClick={onModeChange}>
        Mode: {mode}
      </button>
      <button className="nav-control" aria-label={`Aspect: ${aspectName}`} onClick={onAspectChange}>
        Aspect: {aspectName}
      </button>
      <a
        className="nav-control"
        aria-label="GitHub"
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
      >
        GitHub ↗
      </a>
    </nav>
  );
}
