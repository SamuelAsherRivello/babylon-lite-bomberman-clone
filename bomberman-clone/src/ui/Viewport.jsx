// Keep one centered landscape viewport and four residual gutters.
export function Viewport({ children }) {
  return (
    <main id="browser_surface" className="surface">
      <div className="gutter gutter_top" aria-hidden="true" />
      <div className="gutter gutter_left" aria-hidden="true" />
      <div id="viewport" className="viewport">
        {children}
        <p className="orientation-notice" role="status">
          Rotate your device to landscape to play.
        </p>
      </div>
      <div className="gutter gutter_right" aria-hidden="true" />
      <div className="gutter gutter_bottom" aria-hidden="true" />
    </main>
  );
}
