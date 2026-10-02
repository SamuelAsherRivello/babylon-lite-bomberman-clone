# Original arcade audio

`src/content/audio.js` synthesizes an original looping melody and bass line
with WebAudio triangle/sine oscillators. The sixteen-note sequence and rhythm
were authored for this game; no recordings, samples or existing melodies are
used. Eight event effects cover placement, explosion, block destruction,
pickup, elimination, countdown, wall warning and victory. State comparisons
trigger effects once when authoritative outcomes change; music runs during play.

A pointer or keyboard gesture activates the audio context. Settings provide a
mute checkbox and volume slider controlling one shared output gain. The
documented `?mute=1` URL argument forces silence, disables unmuting, and creates
no audio context. Browser gameplay verification uses this argument. Missing
WebAudio support leaves gameplay playable. Oscillators have short lifetimes,
at most 32 are active, music stops while the tab is hidden or play is paused,
and teardown removes listeners/timers, disconnects nodes and closes the context.

Run `node bomberman-clone/test/audio-browser.mjs` with Vite running on port 5180
or set `GAME_URL`. Real Chrome checks verify generated music and all eight
event signals, actual output-gain automation, mute/volume, silent startup and
context closure after switching modes. Physical speakers and listening quality
remain a human playtesting concern; the automated check verifies signal generation.
