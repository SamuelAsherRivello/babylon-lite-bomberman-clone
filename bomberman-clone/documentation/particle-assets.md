# Bomb particle assets

The optional `Explosion: PFX` presentation uses two animated transparent PNG
sequences copied from the user's local sibling project. Their renderer-side
profiles and atlas assembly live under
`bomberman-clone/src/content/systems/`:

```text
particle-effects-system.js
particle-effects-art.js
```

```text
C:/Users/srive/Documents/ChatGPT/CODEX/babylon-lite-ascii-rpg/
  ascii-rpg/public/assets/pfx/FirePlume_17x1/
  ascii-rpg/public/assets/pfx/SmokePoff_9x1/
```

The Bomberman copies live under `public/assets/pfx/`. `FirePlume` contains 17
frames and plays once during an authoritative explosion. `SmokePoff` contains
9 frames and plays once as the overlapping puff. No PFX art is shown during the
bomb fuse. The source repository does not include a separate license or
attribution file for these particle PNGs; this record identifies the supplied
local source and must be replaced or expanded with redistribution terms before
a public release that includes the assets.
