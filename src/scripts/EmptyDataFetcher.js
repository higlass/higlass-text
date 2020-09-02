
class EmptyDataFetcher {
  constructor(dataConfig) {
    this.dataConfig = dataConfig;
  }

  tilesetInfo(callback) {
    this.tilesetInfoLoading = false;

    // Dummy values - not actually used
    const TILE_SIZE = 1024;
    const MAX_ZOOM = 22

    const retVal = {
      tile_size: TILE_SIZE,
      bins_per_dimension: TILE_SIZE,
      max_zoom: MAX_ZOOM,
      max_width: TILE_SIZE * 2 ** MAX_ZOOM,
      min_pos: [0],
      max_pos: [3000000000],
    };

    if (callback) {
      callback(retVal);
    }

    return retVal;
    
  }

  fetchTilesDebounced(receivedTiles, tileIds) {
    const tiles = {};
    return tiles;
  }

  tile(z, x) {
    return this.tilesetInfo().then((tsInfo) => {
      return [];
    });
  }

  

}

export default EmptyDataFetcher;
