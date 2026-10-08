# Coding standards

These conventions apply to the existing Bomberman Clone source and tests. The root [agent guidance](../../AGENTS.md) has precedence for project-specific requirements. The [project structure](project-structure.md) names module owners and entry points.

## Source and formatting

- Use JavaScript ES modules and React function components. Keep imports at the top and exports intentional. Prefer a function or plain data object over a class unless a lifecycle or owned mutable state warrants one.
- Use two-space indentation, UTF-8, LF endings, a final newline, semicolons, and single quotes in JavaScript. `.editorconfig` describes these basics and `.gitattributes` keeps formatted code at LF endings across Git checkouts. The pinned Prettier configuration is the formatting authority; run `npm run format` after editing code and `npm run format:check` before completion.
- Name React components and state-owning classes in PascalCase, functions and values in camelCase, and stable constants in uppercase when they are genuinely constant. Keep file names responsibility-oriented and follow existing local naming conventions.
- Keep one module's public API small. Make inputs, return values, errors, and disposal expectations clear at the call site. Co-locate contracts with their sole consumer/provider; share them only when two boundaries genuinely depend on them.
- Do not leave unused imports, components, exports, CSS selectors, or custom properties. When JSX classes or IDs change, check the matching CSS and browser assertions in the same change.

## Game, network, and browser boundaries

- Keep local simulation deterministic for a seed and input stream. Pass state and commands explicitly; avoid reading the DOM, wall clock, storage, or network inside rule functions.
- Treat remote snapshots as authoritative for online bombs, damage, pickups, scores, and round transitions. Prediction may improve motion feedback but must not commit authoritative outcomes.
- Browser listeners, animation frames, intervals, audio nodes, and Babylon Lite objects need matching cleanup. Clear held input when focus or control ownership changes.
- Keep WebGPU failure messages visible in React. Babylon Lite is the only renderer; do not introduce a fallback renderer.
- Keep primary HUD and settings inside the viewport and preserve the four corner roles. Use accessible labels for controls and status text. Do not change the existing orientation implementation as part of formatting work.

## Verification and maintenance

- Run `npm run format:check`, `npm test`, and `npm run build` for source changes. The CI workflows run these same local gates. Formatting and bundling do not prove behavior.
- Run the relevant named browser script and inspect the result in a real browser for UI, WebGPU, touch, audio, or live multiplayer changes. The [README](../../README.md#verification) lists prerequisites and commands.
- Add or update focused deterministic tests for rule, prediction, or input behavior. Test observable state transitions and error paths, rather than repeating implementation text.
- Update current README and implementation docs with behavior changes. Preserve dated release and verification records as historical evidence. Use OpenSpec for substantial behavior changes and keep its proposal, tasks, implementation, and accepted specs consistent.
- Keep generated build/report output, local configuration, credentials, and recovery material out of commits. Use the root `.gitignore` and `CONTRIBUTING.md` guidance.
