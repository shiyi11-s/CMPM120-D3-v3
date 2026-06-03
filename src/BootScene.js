class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    const w = this.scale.width, h = this.scale.height;
    const txt = this.add.text(w / 2, h / 2 - 24, "loading...", {
      fontFamily: "ui-monospace, monospace",
      fontSize: "20px",
      color: "#c2b6ff",
    }).setOrigin(0.5);

    const bar = this.add.rectangle(w / 2, h / 2 + 12, 0, 6, 0xa080ff);
    this.load.on("progress", (p) => bar.width = 320 * p);
    this.load.on("complete", () => txt.setText("ready!"));

    this.load.image("marble", "assets/marble.png");
    this.load.image("death",  "assets/death.png");
    this.load.image("bg",     "assets/bg.png");
    this.load.image("spark",  "assets/spark.png");

    this.load.image("tiles", "assets/tileset_DungeonTileSet.png");
    this.load.tilemapTiledJSON("level1", "assets/level1.tmj");
    this.load.tilemapTiledJSON("level2", "assets/level2.tmj");
    this.load.tilemapTiledJSON("level3", "assets/level3.tmj");
  }

  create() {
    this.scene.start("MenuScene");
  }
}