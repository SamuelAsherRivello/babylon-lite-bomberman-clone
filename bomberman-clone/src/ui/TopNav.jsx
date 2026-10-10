const GITHUB_URL = 'https://github.com/SamuelAsherRivello/babylon-lite-bomberman-clone';

export function TopNav({ online, onModeChange }) {
  const mode = online ? 'Online' : 'Offline';
  return (
    <nav className="corner corner_top_right" aria-label="Game navigation">
      {online && (
        <button className="nav-control" aria-label={`Mode: ${mode}`} onClick={onModeChange}>
          Mode: {mode}
        </button>
      )}
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
