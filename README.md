# Display text in HiGlass

![Text](https://aveit.s3.amazonaws.com/higlass/static/higlass-text-screenshot.png)

A [HiGlass](https://github.com/higlass/higlass) plugin track that displays a line of text, e.g. as a title or a label above other tracks.

Requires HiGlass 2.x. Use `higlass-text@0.1` for HiGlass 1.x.

**Note**: This is the source code for the text track only! You might want to check out the following repositories as well:

- HiGlass viewer: https://github.com/higlass/higlass
- HiGlass server: https://github.com/higlass/higlass-server
- HiGlass docker: https://github.com/higlass/higlass-docker

## Installation

```sh
npm install higlass-text
```

## Usage

The track has to be registered with HiGlass before HiGlass is mounted. After that, tracks with `"type": "text"` can be used in view configs.

### Script tag

`dist/higlass-text.js` registers the track as soon as it is loaded. Load it before you create the HiGlass viewer:

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/pixi.js@6/dist/browser/pixi.min.js"></script>
<script src="https://unpkg.com/higlass@2/dist/hglib.min.js"></script>
<script src="https://unpkg.com/higlass-text@1/dist/higlass-text.js"></script>

<script>
  hglib.viewer(document.getElementById('higlass'), viewConfig, {
    bounded: true,
  });
</script>
```

The HiGlass 2 UMD build also expects a `ReactJSXRuntime` global, which React doesn't provide as a script. See [demo/umd.html](demo/umd.html) for a complete page that includes a small shim for it.

### ES modules

```js
import { viewer } from 'higlass';
import { registerTextTrack } from 'higlass-text';

registerTextTrack();

viewer(document.getElementById('higlass'), viewConfig, { bounded: true });
```

`registerTextTrack()` adds the track to `window.higlassTracksByType`. It won't replace another track that is already registered with the type `text`, unless you call `registerTextTrack({ force: true })`. The package has no side effects when it's imported, and `registerTextTrack()` does nothing outside of a browser, so it's safe in server-side rendered apps.

Alternatively, pass the track to HiGlass through its `pluginTracks` option:

```js
import { HiGlassComponent } from 'higlass';
import { TextTrack } from 'higlass-text';

<HiGlassComponent
  viewConfig={viewConfig}
  options={{ pluginTracks: { text: { track: TextTrack, config: TextTrack.config } } }}
/>;
```

This works for tracks in the `top` and `bottom` positions. Tracks in `left`/`right` positions and the track's entries in the options menu need the global registration from `registerTextTrack()`.

### Track definition

```json
{
  "uid": "texttrack",
  "type": "text",
  "height": 25,
  "options": {
    "text": "Text to display",
    "backgroundColor": "#ededed",
    "textColor": "#333333",
    "fontSize": 14,
    "fontFamily": "Arial",
    "fontWeight": "normal",
    "offsetY": 0,
    "align": "left"
  }
}
```

| Option            | Default     | Description                                           |
| ----------------- | ----------- | ----------------------------------------------------- |
| `text`            | `""`        | The text to display                                   |
| `backgroundColor` | `"#ededed"` | Background color of the track                         |
| `textColor`       | `"#333333"` | Text color                                            |
| `fontSize`        | `14`        | Font size in pixels                                   |
| `fontFamily`      | `"Arial"`   | Font family                                           |
| `fontWeight`      | `"normal"`  | Font weight, e.g. `"normal"` or `"bold"`              |
| `offsetY`         | `0`         | Offset of the text from the top of the track (pixels) |
| `align`           | `"left"`    | `"left"`, `"middle"` or `"right"`                     |

All options except `text` and `align` can also be changed in the track's options menu. `align` is only available in the view config, because HiGlass' built-in "Align" menu entry offers top/bottom values, which don't apply to this track.

## Support

For questions, please either open an issue or ask on the HiGlass Slack channel at http://bit.ly/higlass-slack

## Development

Requires Node.js >= 20.19 (`nvm use`).

```sh
git clone https://github.com/higlass/higlass-text.git
cd higlass-text
npm install
```

| Command         | Description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `npm start`     | Demo page at http://localhost:5173 (script tag demo: `/demo/umd.html`)      |
| `npm test`      | Unit tests in Node.js and browser tests in Chrome (needs Google Chrome)     |
| `npm run build` | `dist/higlass-text.mjs` (ES module) and `dist/higlass-text.js` (UMD)        |
| `npm run lint`  | Lint and format check (Biome)                                               |

The script tag demo uses the local UMD build, so run `npm run build` before opening it.
