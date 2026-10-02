// Adapted from the template's centered ratio-preserving viewport and four
// residual gutters. One landscape shape is used at every browser size.
export function Viewport({ children }) {
  return <main id="browser_surface" className="surface">
    <div className="gutter gutter_top" aria-hidden="true" />
    <div className="gutter gutter_left" aria-hidden="true" />
    <div id="viewport" className="viewport">{children}</div>
    <div className="gutter gutter_right" aria-hidden="true" />
    <div className="gutter gutter_bottom" aria-hidden="true" />
  </main>;
}
