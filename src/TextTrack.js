const MARGIN = 5;

const ANCHORS = {
  left: { x: 0, svg: 'start' },
  middle: { x: 0.5, svg: 'middle' },
  right: { x: 1, svg: 'end' },
};

// Must be a regular function (not an arrow function): HiGlass calls it with `new`.
function TextTrack(HGC, ...args) {
  if (!new.target) {
    throw new Error(
      'Uncaught TypeError: Class constructor cannot be invoked without "new"',
    );
  }

  const { colorToHex } = HGC.utils;

  class TextTrackClass extends HGC.tracks.PixiTrack {
    constructor(context, options) {
      super(context, options);

      this.animate = context.animate;

      this.isTrackShownVertically =
        context.definition?.position === 'left' ||
        context.definition?.position === 'right';

      this.textGraphics = new HGC.libraries.PIXI.Text('', {});
      this.pForeground.addChild(this.textGraphics);

      this.initOptions(options);
    }

    /**
     * Track options are normally merged with `defaultOptions` by HiGlass, but
     * not when the track is only passed via `options.pluginTracks`.
     */
    initOptions(options) {
      this.options = { ...TextTrack.config.defaultOptions, ...options };
      this.fontSize = +this.options.fontSize;
      this.textOptions = {
        fontSize: `${this.fontSize}px`,
        fontFamily: this.options.fontFamily,
        fontWeight: this.options.fontWeight,
        fill: colorToHex(this.options.textColor),
      };
    }

    /*
     * Redraw the track because the options changed
     */
    rerender(options, force) {
      const strOptions = JSON.stringify(options);
      if (!force && strOptions === this.prevOptions) return;
      this.prevOptions = strOptions;

      this.initOptions(options);
      super.rerender(this.options);
      this.renderText();

      requestAnimationFrame(this.animate);
    }

    setPosition(newPosition) {
      super.setPosition(newPosition);
      this.renderText();
    }

    setDimensions(newDimensions) {
      super.setDimensions(newDimensions);
      this.renderText();
    }

    renderText() {
      const text = this.textGraphics;
      if (!text) return;
      const anchor = ANCHORS[this.options.align] ?? ANCHORS.left;
      const width = this.dimensions[0];

      text.text = this.options.text ?? '';
      text.style = this.textOptions;
      text.anchor.set(anchor.x, 0);
      text.y = +this.options.offsetY || 0;

      // Vertical tracks are rotated by HiGlass, so the text is mirrored to stay
      // readable and the left/right positions swap.
      text.scale.x = this.isTrackShownVertically ? -1 : 1;
      const fraction = this.isTrackShownVertically ? 1 - anchor.x : anchor.x;
      text.x = MARGIN + fraction * (width - 2 * MARGIN);

      this.svgAnchor = anchor.svg;
      this.svgX = text.x;
    }

    draw() {}

    getMouseOverHtml() {
      return '';
    }

    remove() {
      this.textGraphics.destroy();
      super.remove();
    }

    exportSVG() {
      const [base, track] = super.exportSVG();

      const output = document.createElement('g');
      output.setAttribute(
        'transform',
        `translate(${this.position[0]},${this.position[1]})`,
      );
      track.appendChild(output);

      const scaleX = this.isTrackShownVertically ? -1 : 1;
      const gText = document.createElement('g');
      gText.setAttribute(
        'transform',
        `translate(${this.svgX},${this.textGraphics.y + this.fontSize})scale(${scaleX},1)`,
      );

      const t = document.createElement('text');
      t.setAttribute('text-anchor', this.svgAnchor);
      t.setAttribute('font-family', this.options.fontFamily);
      t.setAttribute('font-size', `${this.fontSize}px`);
      t.setAttribute('font-weight', this.options.fontWeight);
      t.setAttribute('fill', this.options.textColor);
      t.textContent = this.textGraphics.text;

      gText.appendChild(t);
      output.appendChild(gText);

      return [base, track];
    }
  }

  return new TextTrackClass(...args);
}

// A "T" on the track's default background and text colors.
const icon =
  '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="19" height="19" rx="3" fill="#ededed" stroke="#999999"/><path fill="#333333" d="M5 4.5h10v2.75h-3.6V15.5H8.6V7.25H5z"/></svg>';

let thumbnail;

// Greys plus the d3 category10 colors, which stay readable as text.
const COLORS = [
  ['Black', '#000000'],
  ['Dark Grey', '#333333'],
  ['Grey', '#777777'],
  ['Light Grey', '#cccccc'],
  ['White', '#ffffff'],
  ['Red', '#d62728'],
  ['Orange', '#ff7f0e'],
  ['Yellow', '#ffd700'],
  ['Green', '#2ca02c'],
  ['Teal', '#17becf'],
  ['Blue', '#1f77b4'],
  ['Purple', '#9467bd'],
  ['Pink', '#e377c2'],
  ['Brown', '#8c564b'],
];

const inlineOptions = (values, name = (v) => v) =>
  Object.fromEntries(values.map((v) => [v, { name: name(v), value: v }]));

TextTrack.config = {
  type: 'text',
  datatype: ['bedlike'],
  local: false,
  orientation: '1d-horizontal',
  // Created lazily so that the module can be imported outside of a browser.
  get thumbnail() {
    if (thumbnail === undefined && typeof DOMParser !== 'undefined') {
      thumbnail = new DOMParser().parseFromString(
        icon,
        'text/xml',
      ).documentElement;
    }
    return thumbnail ?? null;
  },
  // `align` and `text` can only be set in the view config: HiGlass' built-in
  // `align` menu entry offers top/bottom, which doesn't apply to this track.
  availableOptions: [
    'backgroundColor',
    'textColor',
    'fontSize',
    'fontFamily',
    'fontWeight',
    'offsetY',
  ],
  optionsInfo: {
    textColor: {
      name: 'Text Color',
      inlineOptions: Object.fromEntries(
        COLORS.map(([name, value]) => [value, { name, value }]),
      ),
    },
    fontFamily: {
      name: 'Font Family',
      inlineOptions: inlineOptions([
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Courier New',
        'sans-serif',
        'serif',
        'monospace',
      ]),
    },
    fontWeight: {
      name: 'Font Weight',
      inlineOptions: inlineOptions(['normal', 'bold']),
    },
    offsetY: {
      name: 'Vertical Offset',
      inlineOptions: inlineOptions(
        [0, 2, 4, 6, 8, 10, 15, 20],
        (v) => `${v}px`,
      ),
    },
  },
  defaultOptions: {
    backgroundColor: '#ededed',
    textColor: '#333333',
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    align: 'left',
    offsetY: 0,
    text: '',
  },
};

export default TextTrack;
