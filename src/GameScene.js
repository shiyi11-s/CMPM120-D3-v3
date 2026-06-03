class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  init(data) {
    this.level = data && data.level ? data.level : 1;
    RUN.level = this.level;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(280, 0, 0, 0);

    const map = this.make.tilemap({ key: "level" + this.level });
    const tileset = map.addTilesetImage("tileset_DungeonTileSet", "tiles");

    const floor = map.createLayer("Floor", tileset, 0, 0);
    const walls = map.createLayer("Walls", tileset, 0, 0);

    const mapPixelW = map.widthInPixels;
    const mapPixelH = map.heightInPixels;
    const zoom = Math.min(W / mapPixelW, H / mapPixelH);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(mapPixelW / 2, mapPixelH / 2);
  }
}
