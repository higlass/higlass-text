import TextTrack from './TextTrack';

/**
 * Registers the text track with HiGlass by adding it to
 * `window.higlassTracksByType`. Call this before HiGlass is mounted.
 *
 * Registration is needed for tracks in left/right positions and for the
 * track's entries in the options menu. Does nothing outside of a browser.
 *
 * @param {{ force?: boolean }} [options] Set `force` to replace another track
 *   that is already registered with the type `text`.
 * @returns The plugin track definition, which can also be passed to HiGlass
 *   via `options.pluginTracks = { text: definition }`.
 */
export function registerTextTrack({ force = false } = {}) {
  const definition = {
    name: 'TextTrack',
    track: TextTrack,
    config: TextTrack.config,
  };

  if (typeof window === 'undefined') return definition;

  window.higlassTracksByType = window.higlassTracksByType || {};
  const existing = window.higlassTracksByType[TextTrack.config.type];

  if (existing && existing.track !== TextTrack && !force) {
    console.warn(
      `A track with the type "${TextTrack.config.type}" is already registered. To override it, set force to true.`,
    );
    return definition;
  }

  window.higlassTracksByType[TextTrack.config.type] = definition;
  return definition;
}
