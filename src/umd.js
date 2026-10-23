// Entry for the script tag build (dist/higlass-text.js): registers the track
// as soon as it is loaded.
import TextTrack from './TextTrack';
import { registerTextTrack } from './register';

registerTextTrack();

export { registerTextTrack, TextTrack };
export default TextTrack;
