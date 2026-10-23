import { viewer } from 'higlass';

import { registerTextTrack } from '../src';
import { viewConfig } from './viewconf';

registerTextTrack();

window.hgApi = viewer(document.getElementById('demo'), viewConfig, {
  bounded: true,
});
