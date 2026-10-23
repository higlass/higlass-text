import { describe, expect, it } from 'vitest';

import TextTrackDefault, { registerTextTrack, TextTrack } from '../../src';

describe('TextTrack outside of a browser', () => {
  it('can be imported without DOM globals', () => {
    expect(typeof DOMParser).toBe('undefined');
    expect(TextTrack).toBe(TextTrackDefault);
  });

  it('has no thumbnail without a DOM', () => {
    expect(TextTrack.config.thumbnail).toBeNull();
  });

  it('keeps its track config', () => {
    expect(TextTrack.config.type).toBe('text');
    expect(TextTrack.config.datatype).toEqual(['bedlike']);
    expect(TextTrack.config.orientation).toBe('1d-horizontal');
  });

  it('is a constructible function that requires new', () => {
    expect(TextTrack.prototype).toBeDefined();
    expect(() => TextTrack({})).toThrow(/without "new"/);
  });

  it('only registers when window is available', () => {
    expect(typeof window).toBe('undefined');
    const definition = registerTextTrack();
    expect(definition.track).toBe(TextTrack);
    expect(definition.config).toBe(TextTrack.config);
  });
});
