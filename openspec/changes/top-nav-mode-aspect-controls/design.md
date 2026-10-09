# Design

## Context

See [proposal.md](proposal.md) for motivation and the capability deltas for observable behavior. `App.jsx` owns the practice/online branch, currently starts in practice unless the URL requests online play or has a room, and passes mode-switch callbacks to two separately rendered top navs. `Viewport.jsx` owns the shared gutter shell. `style.css` selects both viewport ratio and composition with primary-pointer media rules, while `renderer.js` already derives the arena fit from the canvas's current CSS dimensions on each draw. The completed `responsive-arena-layout` change established pointer-selected defaults and intentionally excluded a selector; this newer request replaces that selector decision. Its deltas have not yet been synced into the main specs, so this change's modified requirements carry forward the complete responsive behavior.

## Goals / Non-Goals

**Goals:**

- Keep mode and aspect state above the practice/online component branch so switching modes retains the selected aspect.
- Let a selected composition reflow the existing viewport and arena without restarting the renderer or changing gameplay/input semantics.
- Keep the three nav controls accessible and visible at compact viewport sizes, including a sideways-held phone.

**Non-Goals:**

- Persist the aspect choice across page reloads or add an orientation lock.
- Change multiplayer backend selection, room protocol, game rules, or audio behavior.

## Decisions

### Keep page state in `App`

Initialize mode as online unless the URL explicitly says `mode=offline`; any `room` argument retains online entry as it does today, and `mode=online` remains supported. Continue switching modes through React state without rewriting the URL. The backend resolver stays as it is: local Vite chooses the local backend, and a production build chooses the public backend when no `server` override is present. This preserves the existing server/test isolation contract. A routing library or URL rewrite would add scope without helping the requested navigation.

Store a nullable aspect override in `App`: `null` follows `matchMedia('(pointer: coarse)')`, otherwise the override selects landscape or portrait. While there is no override, a primary-pointer change updates the default; after an explicit selection, the choice stays fixed until reload and survives practice/online switches. Pass the effective aspect to `Viewport` in either branch. Keeping this state in either mode component would reset the aspect when that branch unmounts.

### Render a shared navigation component

Use one React component in `src/ui/` for the upper-right corner in both modes. Render two native buttons whose visible text reports current state and whose click handlers toggle mode or aspect. Render the existing GitHub destination as an anchor with the same visual button class; it remains a link so opening the repository in a new tab and normal link actions work. Keep the title, settings and version in their established corners. A shared component prevents the mode branches from drifting in text or styling.

### Separate composition from pointer-specific input styling

Put the effective aspect on the shared `.surface` as a data attribute. Move viewport ratio, side-by-side/stacked grid, and aspect-specific panel sizing behind selected-aspect selectors. Retain pointer media rules only for genuinely input-dependent adjustments. Audit the existing coarse-and-physical-landscape overrides so they compact the selected layout without forcing portrait or hiding GitHub. This is necessary for a fine-pointer portrait choice and a coarse-pointer landscape choice; simply adding a ratio override would leave the wrong grid in place.

Allow the header/nav to wrap within the panel at narrow sizes and compact spacing/type through existing container queries. Keep all three controls in the top-right corner, within the viewport, and preserve the complete no-scroll panel by allowing the arena slot to yield space. The renderer's per-draw canvas measurements already adapt to the resized square slot; keep its integer sizing policy unchanged.

## Risks / Trade-offs

- [Risk] Three controls and the title may overflow a very narrow panel → Permit the header and nav to wrap, compact them in container rules, and check both modes on mobile portrait and sideways-held sizes.
- [Risk] Composition CSS is mixed with coarse-pointer and physical-orientation rules → Separate selected-aspect layout rules from input-specific rules, then verify all four pointer/aspect combinations.
- [Risk] Defaulting to online breaks practice-oriented browser checks or makes a local dev page appear unable to play without a backend → Use `mode=offline` explicitly in practice checks, document direct offline entry, and keep local Vite's backend default unchanged.
- [Risk] A room invite carries a conflicting `mode=offline` parameter → Give the existing `room` parameter precedence so the client still opens online and can report any invalid code there.

## Migration Plan

Update the client, documentation, and affected browser scripts together. No stored preference or server migration is needed. Rollback restores the prior default mode, pointer-only composition and navigation presentation as one client change.
