import { viewer } from 'higlass';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TextTrack, registerTextTrack } from '../../src';
import simpleTrack from './simple-track.json';

const VIEW_UID = simpleTrack.views[0].uid;
const TRACK_UID = simpleTrack.views[0].tracks.top[0].uid;

let api = null;
let div = null;

const viewConfigWith = (tracks) => {
  const viewConfig = structuredClone(simpleTrack);
  Object.assign(viewConfig.views[0].tracks, tracks);
  return viewConfig;
};

async function mount(viewConfig, options = {}) {
  div = document.createElement('div');
  div.style.width = '800px';
  div.style.height = '400px';
  document.body.appendChild(div);
  api = await viewer(div, viewConfig, { bounded: true, ...options });
  return api;
}

async function getTrack(trackUid = TRACK_UID) {
  return vi.waitFor(() => {
    const track = api.getTrackObject(VIEW_UID, trackUid);
    const textTrack = track?.originalTrack ?? track;
    if (!textTrack?.textGraphics || textTrack.dimensions[0] <= 1) {
      throw new Error('Track not ready');
    }
    return textTrack;
  });
}

// React 18 warnings that HiGlass 2.x itself logs.
const KNOWN_HIGLASS_ERRORS = [
  /importing createRoot from "react-dom"/,
  /ReactDOM.render is no longer supported/,
];

function spyOnErrors() {
  const spy = vi.spyOn(console, 'error');
  return () =>
    spy.mock.calls.filter(
      ([msg]) => !KNOWN_HIGLASS_ERRORS.some((re) => re.test(String(msg))),
    );
}

function resetRegistry() {
  delete window.higlassTracksByType;
}

afterEach(() => {
  api?.destroy();
  div?.remove();
  api = null;
  div = null;
  resetRegistry();
  vi.restoreAllMocks();
});

describe('registerTextTrack', () => {
  it('adds the track to window.higlassTracksByType', () => {
    const definition = registerTextTrack();
    expect(window.higlassTracksByType.text).toBe(definition);
    expect(definition.track).toBe(TextTrack);
  });

  it('only overrides another text track when forced', () => {
    const other = { track: () => {}, config: { type: 'text' } };
    window.higlassTracksByType = { text: other };
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    registerTextTrack();
    expect(window.higlassTracksByType.text).toBe(other);
    expect(console.warn).toHaveBeenCalled();

    registerTextTrack({ force: true });
    expect(window.higlassTracksByType.text.track).toBe(TextTrack);
  });

  it('happens automatically for the script tag entry', async () => {
    const umd = await import('../../src/umd.js');
    expect(window.higlassTracksByType.text.track).toBe(umd.TextTrack);
  });
});

describe('TextTrack in HiGlass', () => {
  it('provides a thumbnail element', () => {
    expect(TextTrack.config.thumbnail).toBeInstanceOf(Element);
    expect(TextTrack.config.thumbnail.outerHTML).toContain('<svg');
  });

  it('renders when only passed via options.pluginTracks', async () => {
    const definition = registerTextTrack();
    resetRegistry();

    await mount(structuredClone(simpleTrack), {
      pluginTracks: { text: definition },
    });
    const track = await getTrack();
    expect(track.textGraphics.text).toBe('Description 3');
    // Default options are applied even though HiGlass doesn't know the track.
    expect(track.options.fontFamily).toBe('Arial');
  });

  it('aligns, resizes and exports the text', { timeout: 20000 }, async () => {
    registerTextTrack();
    const errors = spyOnErrors();

    await mount(structuredClone(simpleTrack));
    const track = await getTrack();

    expect(track.svgAnchor).toBe('end');
    expect(track.svgX).toBe(track.dimensions[0] - 5);

    const prevWidth = track.dimensions[0];
    div.style.width = '600px';
    // HiGlass refreshes the view with a delay after a resize.
    await vi.waitFor(
      () => {
        if (track.dimensions[0] === prevWidth) throw new Error('Not resized');
      },
      { timeout: 10000, interval: 100 },
    );
    expect(track.svgX).toBe(track.dimensions[0] - 5);

    const svg = api.exportAsSvg();
    expect(svg).toContain('Description 3');
    expect(svg).toContain('text-anchor="end"');

    expect(errors()).toEqual([]);
  });

  it('escapes the text in the SVG export', async () => {
    registerTextTrack();
    const viewConfig = structuredClone(simpleTrack);
    viewConfig.views[0].tracks.top[0].options.text = '<b>bold</b>';

    await mount(viewConfig);
    await getTrack();

    const svg = api.exportAsSvg();
    expect(svg).toContain('&lt;b&gt;bold&lt;/b&gt;');
    expect(svg).not.toContain('<b>bold</b>');
  });

  it('rerenders when the options change', async () => {
    registerTextTrack();
    await mount(structuredClone(simpleTrack));
    const track = await getTrack();

    track.rerender({ ...track.options, text: 'Changed', align: 'middle' });
    expect(track.textGraphics.text).toBe('Changed');
    expect(track.svgAnchor).toBe('middle');
    expect(track.svgX).toBe(track.dimensions[0] / 2);
  });

  it('renders in a left position', async () => {
    registerTextTrack();
    const errors = spyOnErrors();

    await mount(
      viewConfigWith({
        left: [
          {
            uid: 'vertical',
            type: 'text',
            width: 30,
            options: { text: 'Vertical', align: 'left' },
          },
        ],
      }),
    );
    const track = await getTrack('vertical');

    expect(track.isTrackShownVertically).toBe(true);
    expect(track.textGraphics.scale.x).toBe(-1);
    expect(track.svgAnchor).toBe('start');
    expect(errors()).toEqual([]);
  });
});
