const server = 'https://higlass.io/api/v1';
const chromInfoPath = '//s3.amazonaws.com/pkerp/data/hg19/chromSizes.tsv';

const textTrack = (uid, options) => ({
  uid,
  type: 'text',
  height: 24,
  options: { offsetY: 3, ...options },
});

export const viewConfig = {
  editable: true,
  trackSourceServers: [server],
  views: [
    {
      uid: 'demo',
      layout: { w: 12, h: 8, x: 0, y: 0 },
      initialXDomain: [2521015726, 2558682921],
      initialYDomain: [2521015726, 2558682921],
      chromInfoPath,
      tracks: {
        top: [
          textTrack('text-left', { text: 'Left aligned', align: 'left' }),
          textTrack('text-middle', {
            text: 'Middle aligned',
            align: 'middle',
            backgroundColor: '#8F00FF',
            textColor: '#ffffff',
          }),
          textTrack('text-right', {
            text: 'Right aligned',
            align: 'right',
            fontWeight: 'bold',
          }),
          {
            // The genome position search box needs a chromosome track with a
            // tileset.
            uid: 'chroms',
            type: 'horizontal-chromosome-labels',
            height: 30,
            server,
            tilesetUid: 'N12wVGG9SPiTkk03yUayUw',
          },
          {
            uid: 'genes',
            type: 'horizontal-gene-annotations',
            height: 60,
            server,
            tilesetUid: 'OHJakQICQD6gTD7skx4EWA',
          },
        ],
        left: [
          {
            ...textTrack('text-vertical', {
              text: 'Left position',
              align: 'middle',
            }),
            width: 24,
          },
        ],
        center: [],
        right: [],
        bottom: [],
        whole: [],
        gallery: [],
      },
    },
  ],
};
