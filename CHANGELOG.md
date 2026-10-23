# Changelog

## 1.0.0

Requires HiGlass 2.x.

### Breaking changes

- The `es/` folder is gone. Import from the package root (`import { TextTrack } from 'higlass-text'`). Deep imports such as `higlass-text/es/TextTrack` no longer work.
- The package ships `dist/higlass-text.mjs` (ES module, no side effects) and `dist/higlass-text.js` (UMD, registers the track when loaded, global `higlass-text`). `dist/higlass-text.nomin.js` is no longer built.
- The track extends HiGlass' `PixiTrack` instead of `BedLikeTrack` and no longer creates a placeholder data fetcher or tiles.
- `align` is no longer listed in the options menu. HiGlass' built-in "Align" entry offers top/bottom values, which this track can't use. `align` still works in view configs.
- `peerDependencies`: `higlass ^2.0.0`. Development requires Node.js >= 20.19.

### New

- `registerTextTrack({ force })` registers the track on `window.higlassTracksByType` for ES module users.
- The package can be imported outside of a browser, e.g. during server-side rendering. The track thumbnail is created lazily.
- Options menu entries for text color, font family, font weight and vertical offset, and more background colors. Because HiGlass shares plugin option lists across tracks, the extended background color list also appears for other tracks; it includes all of HiGlass' built-in background colors.
- Track default options are also applied when the track is only passed through HiGlass' `pluginTracks` option.

### Fixes

- Middle- and right-aligned text now moves when the track is resized.
- The text is no longer recreated on every render, which leaked PIXI text objects.
- The SVG export escapes the text instead of inserting it as HTML.
- Removed the broken `destroyTile` and other unused tile handling code.

### Dependencies

- No runtime dependencies anymore: removed `d3-color`, `d3-scale`, `slugid` (which pulled in an outdated `uuid`) and `higlass-register`.
- The build uses Vite, tests use Vitest, and linting uses Biome, replacing Babel 6, webpack 4 and Karma.
