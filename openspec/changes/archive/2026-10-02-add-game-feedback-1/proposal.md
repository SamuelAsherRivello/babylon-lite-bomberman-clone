# Proposal

## Why
The current demo leaves landscape space unused and requires multiple humans before a battle can start. Gather the requested arena options, power-ups and clearer feedback into one complete four-combatant experience that remains playable from the README.

## What Changes
- Use the full landscape viewport with a separate UI area; retain the whole arena, Pixel Perfect rendering and four corner roles.
- **BREAKING:** Always field four combatants: 1/2/3/4 humans plus 3/2/1/0 CPUs. Offer CPU: LOW/MED/HARD; bots do not consume human connection slots.
- Accept letter controls regardless of Caps Lock or Shift. Prevent sideways movement between opposing blocks while retaining forgiving collision along open corridors.
- Explain every power-up icon in the UI, including bomb capacity, range, speed, boxing glove and lightning.
- Freeze the visible death scene for three seconds before showing the death/result prompt, without stopping other humans' online battle.
- Offer MAP: LOW/MED/HIGH with progressively larger arenas.
- Add a rare boxing glove: push bombs for the rest of that life; pushed bombs travel until blocked and then explode.
- Add lightning: complete invulnerability for ten seconds, character flashing throughout, faster flashing during the final second.
- Flash bombs twice during the final half-second before detonation; provide a Bomb Flash: ON/OFF checkbox preference.
- Offer Plant: ON/OFF. When enabled, seed one random plant, spread into adjacent available cells periodically, kill on contact, and allow explosions to remove individual segments.
- Integrate authoritative rules and smooth prediction/interpolation, update both repositories, publish a compatible multiplayer version and keep the README play link current.

## Capabilities
### New Capabilities
- `cpu-battles`: four-combatant roster, fair CPU intelligence and human replacement.
### Modified Capabilities
- `arena-foundation`: selectable arena geometry, corridor constraints and immunity exceptions.
- `arena-progression`: rare pickups, plant growth and immunity during sudden death.
- `authoritative-arena`: authoritative new mechanics and smooth moving-bomb presentation.
- `multiplayer-rooms`: single-human readiness with CPUs and bounded reconnect replacement.
- `match-loop`: CPU-inclusive matches, delayed results and single-human rematches.
- `pixel-perfect-presentation`: full landscape layout and case-insensitive controls.
- `arcade-presentation`: five-icon legend, three-second death view and bomb-flash preference.

## Impact
Affects shared deterministic rules, CPU controller, Colyseus room/simulation and released client package; local/online React UI, original atlas artwork, renderer sizing, input and verification scripts. Existing two-human-only and late-spectator tests must follow the new roster contract. Preserve unrelated server games and the accepted five-minute hosting limit.

## Evidence and remaining scope
Implementation is committed in game revision fb75dc8 and released as v0.0.5; the compatible shared server/client is v0.9.7. Tasks 1–4 are complete: 40 client checks and build, 70 server regressions and typecheck, local two-browser full-match/rematch with latency and jitter, and WebGPU presentation checks have passed. This evidence covers all twelve requested features; no additional gameplay implementation is proposed here.

Remaining delivery work stays in tasks 5.1–5.4:
- Reconcile README version, release links, screenshots and verification documentation while preserving the Original AI Prompt.
- Audit both repositories' release/deployment results and generated release commits against the published client and backend.
- Complete public two-client full-match/rematch verification. The latest public reconnect attempt lost admission before the accepted five-minute limit; local recovery passed, so public acceptance remains open rather than being inferred from local results. Preserve honest room-expiry and recreation guidance.
- Strictly validate, sync the eight capability deltas into durable specs, archive this change, and commit/push final documentation and artifacts.

Delivery tasks 5.1–5.4 now have acceptance evidence: README and audit are current, release and Pages workflows succeeded, public full-match/rematch and CPU checks passed, and strict change validation passed. Mandatory sync/archive/final commit/push follow the readiness gate; their actual records establish finalization. The failed shared public checks for unrelated games and intermittent host resets remain disclosed.

## Current implementation defaults
16:9 display; maps LOW 15x13, MED 19x15, HIGH 23x17; CPU MED; map LOW; Bomb Flash ON; Plant OFF, growth every five seconds. Gameplay settings are host-only before matches. Pushed bombs travel six tiles/second; human takeover preserves the existing CPU seat's life, position, upgrades and score. These are implementation choices documented in the design, not additional user requirements.
