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
Released v0.0.4 does not include this change. Uncommitted local prototypes cover dynamic rules, CPU planning, key normalization and six focused fixtures; these are not integrated or accepted completion. The full test suite has an outdated three-item assertion to reconcile, and server/UI/browser/release work remains. All implementation tasks stay unchecked until their acceptance checks pass.

## Proposed defaults, not confirmed choices
16:9 display; maps LOW 15x13, MED 19x15, HIGH 23x17; CPU MED; map LOW; Bomb Flash ON; Plant OFF, growth every five seconds. Suggested host-only gameplay settings before matches, six tiles/second bomb pushing and human takeover of an existing CPU seat without resetting its state or score. These are concrete recommendations for review, not claims of user approval.
