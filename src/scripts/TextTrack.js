import slugid from "slugid";
import EmptyDataFetcher from "./EmptyDataFetcher";

const TextTrack = (HGC, ...args) => {
  if (!new.target) {
    throw new Error(
      'Uncaught TypeError: Class constructor cannot be invoked without "new"'
    );
  }

  // Services
  const { tileProxy } = HGC.services;

  // Utils
  const { colorToHex } = HGC.utils;

  class TextTrackClass extends HGC.tracks.BedLikeTrack {
    constructor(context, options) {
      context.dataFetcher = new EmptyDataFetcher(context.dataConfig);

      super(context, options);
      console.log(context, options);

      this.isTrackShownVertically =
        context.definition.position === "left" ||
        context.definition.position === "right";

      this.options = options;
      this.initOptions();
    }

    initTile(tile) {}

    initOptions() {
      this.fontSize = +this.options.fontSize;

      this.colors = {};
      this.colors["textColor"] = colorToHex(this.options.textColor);
      this.colors["black"] = colorToHex("#000000");
      this.colors["white"] = colorToHex("#ffffff");
      this.colors["lightgrey"] = colorToHex("#ededed");

      this.text = this.options.text;

      this.textOptions = {
        fontSize: `${this.fontSize}px`,
        fontFamily: this.options.fontFamily,
        fontWeight: this.options.fontWeight,
        fill: this.colors["textColor"],
      };
    }

    drawTile() {}

    /*
     * Redraw the track because the options
     * changed
     */
    rerender(options, force) {
      const strOptions = JSON.stringify(options);
      if (!force && strOptions === this.prevOptions) return;

      this.options = options;
      this.initOptions();

      this.prevOptions = strOptions;

      this.renderText();
    }

    drawTile(tile) {}

    renderTile(tile) {}

    draw() {}

    renderText() {
      this.pForeground.clear();
      this.pForeground.removeChildren();
      console.log(this.textOptions);
      const text = new HGC.libraries.PIXI.Text(this.text, this.textOptions);
      text.interactive = true;
      text.anchor.x = 0;
      text.anchor.y = 0;
      text.visible = true;
      text.y = this.options.offsetY;

      const margin = 5;
      text.x = margin;

      if(!this.isTrackShownVertically){
        if(this.options.align === "left"){
          text.anchor.x = 0;
          text.x = margin;
        }
        else if(this.options.align === "middle"){
          text.anchor.x = 0.5;
          text.x = this.dimensions[0] / 2;
        }
        else if(this.options.align === "right"){
          text.anchor.x = 1;
          text.x = this.dimensions[0] - margin;
        }
      }
      else{
        if(this.options.align === "left"){
          text.anchor.x = 1;
          text.scale.x *= -1;
        }
        else if(this.options.align === "middle"){
          text.anchor.x = 0.5;
          text.scale.x *= -1;
          text.x = this.dimensions[0] / 2;
        }
        else if(this.options.align === "right"){
          text.anchor.x = 0;
          text.scale.x *= -1;
          text.x = this.dimensions[0] - margin;
        }
      }
      
      

      

      this.pForeground.addChild(text);
    }

    zoomedY(yPos, kMultiplier) {}

    movedY(dY) {}

    /** cleanup */
    destroyTile(tile) {
      tile.graphics.destroy();
      tile = null;
    }

    getMouseOverHtml(trackX, trackY) {}

    exportSVG() {
      let track = null;
      let base = null;

      base = document.createElement("g");
      track = base;

      const clipPathId = slugid.nice();

      const gClipPath = document.createElement("g");
      gClipPath.setAttribute("style", `clip-path:url(#${clipPathId});`);

      track.appendChild(gClipPath);

      // define the clipping area as a polygon defined by the track's
      // dimensions on the canvas
      const clipPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "clipPath"
      );
      clipPath.setAttribute("id", clipPathId);
      track.appendChild(clipPath);

      const clipPolygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      clipPath.appendChild(clipPolygon);

      clipPolygon.setAttribute(
        "points",
        `${this.position[0]},${this.position[1]} ` +
          `${this.position[0] + this.dimensions[0]},${this.position[1]} ` +
          `${this.position[0] + this.dimensions[0]},${
            this.position[1] + this.dimensions[1]
          } ` +
          `${this.position[0]},${this.position[1] + this.dimensions[1]} `
      );

      const output = document.createElement("g");

      output.setAttribute(
        "transform",
        `translate(${this.position[0]},${this.position[1]})`
      );

      gClipPath.appendChild(output);

      return [base, base];
    }
  }
  return new TextTrackClass(...args);
};

const icon =
  '<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M-1-1h22v22H-1z"/><g><path stroke="#007fff" stroke-width="1.5" fill="#007fff" d="M-.667-.091h5v20.167h-5z"/><path stroke-width="1.5" stroke="#e8e500" fill="#e8e500" d="M5.667.242h5v20.167h-5z"/><path stroke-width="1.5" stroke="#ff0038" fill="#ff0038" d="M15.833.076h5v20.167h-5z"/><path stroke="green" stroke-width="1.5" fill="green" d="M10.833-.258H14.5v20.167h-3.667z"/></g></svg>';

// default
TextTrack.config = {
  type: "text",
  datatype: ["bedlike"],
  local: false,
  orientation: "1d-horizontal",
  thumbnail: new DOMParser().parseFromString(icon, "text/xml").documentElement,
  availableOptions: [
    "backgroundColor",
    "textColor",
    "fontSize",
    "fontWeight",
    "offsetY",
    "align",
    "text",
  ],
  defaultOptions: {
    backgroundColor: "#808080",
    textColor: "#ffffff",
    fontSize: 14,
    fontFamily: "Arial",
    fontWeight: "normal",
    align: "left",
    offsetY: 0,
    text: "",
  },
};

export default TextTrack;
