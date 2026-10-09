// Keep the template's centered viewport and four residual gutters.
export function Viewport({ aspect, children }) {
  return (
    <main id="browser_surface" className="surface" data-aspect={aspect}>
      <div className="gutter gutter_top" aria-hidden="true" />
      <div className="gutter gutter_left" aria-hidden="true" />
      <div id="viewport" className="viewport">
        {children}
      </div>
      <div className="gutter gutter_right" aria-hidden="true" />
      <div className="gutter gutter_bottom" aria-hidden="true" />
    </main>
  );
}
