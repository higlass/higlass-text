import { expect } from "chai";
import register from "higlass-register";

import FetchMockHelper from "./utils/FetchMockHelper";

import { HiGlassComponent, getTrackObjectFromHGC } from "higlass";

import {
  waitForDataLoaded,
  mountHGComponent,
  removeHGComponent,
} from "./utils/test-helpers";

import viewConf from "./view-configs/simple-track";

import TextTrack from "../src/scripts/TextTrack";

register({
  name: "TextTrack",
  track: TextTrack,
  config: TextTrack.config,
});

describe("SVG export", () => {
  const fetchMockHelper = new FetchMockHelper("", "SVGExport");

  beforeAll(async () => {
    await fetchMockHelper.activateFetchMock();
  });

  describe("SVG export", () => {
    let hgc = null;
    let div = null;

    beforeAll((done) => {
      [div, hgc] = mountHGComponent(div, hgc, viewConf, done);
    });

    it("tests that the export works and the data is correct", (done) => {
      const trackObj = getTrackObjectFromHGC(
        hgc.instance(),
        viewConf.views[0].uid,
        viewConf.views[0].tracks.top[0].uid
      );

      setTimeout(() => {
        hgc.instance().handleExportSVG();

        expect(trackObj.svgAnchor).to.equal("end");
        expect(trackObj.svgX).to.equal(765);
        expect(trackObj.svgX).to.equal(1);

        done();
      }, 2000);
    });

    afterAll(() => {
      removeHGComponent(div);
    });
  });

  afterAll(async () => {
    await fetchMockHelper.storeDataAndResetFetchMock();
  });
});
