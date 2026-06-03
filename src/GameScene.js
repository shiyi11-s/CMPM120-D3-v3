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

    walls.setCollisionByExclusion([-1]);

    const mapPixelW = map.widthInPixels;
    const mapPixelH = map.heightInPixels;
    const zoom = Math.min(W / mapPixelW, H / mapPixelH);
    this.cameras.main.setZoom(zoom);
    this.cameras.main.centerOn(mapPixelW / 2, mapPixelH / 2);

    const objects = map.getObjectLayer("Object Layer 1").objects;

    const spawnObj = objects.find(o => o.name === "spawn");
    const goalObj  = objects.find(o => o.name === "goal");
    const deathObjs = objects.filter(o => o.name === "death");

    this.spawnX = spawnObj.x - 16;
    this.spawnY = spawnObj.y + spawnObj.height / 2;

    const goalX = goalObj.x + goalObj.width / 2;
    const goalY = goalObj.y + goalObj.height / 2;

    this.add.text(goalX, goalY, "EXIT", {
      fontFamily: "ui-monospace, monospace",
      fontSize: "18px",
      color: "#ffd166",
    }).setOrigin(0.5);

    this.goalZone = this.physics.add.image(goalX, goalY, "__DEFAULT").setVisible(false);
    this.goalZone.setDisplaySize(goalObj.width, goalObj.height);
    this.goalZone.body.allowGravity = false;
    this.goalZone.body.immovable = true;

    this.deathGroup = this.physics.add.staticGroup();
    for (const d of deathObjs) {
      const dz = this.deathGroup.create(
        d.x + d.width / 2, d.y + d.height / 2, "death"
      );
      dz.setDisplaySize(d.width, d.height).refreshBody();
    }

    this.marble = this.physics.add.image(this.spawnX, this.spawnY, "marble");
    this.marble.setScale(0.7);
    this.marble.setBounce(0.32);
    this.marble.setDamping(true);
    this.marble.setDrag(0.985);
    this.marble.setMaxVelocity(520, 520);
    this.marble.setMass(1);
    this.marble.setCircle(10, 2, 2);

    this.physics.add.collider(this.marble, walls);

    this.tiltAngle = 0;
    this.draggingState = null;

    this.input.on("pointerdown", this.onPointerDown, this);
    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerup",   this.onPointerUp,   this);
  }

  pointerVecFromCenter(pointer) {
    return {
      x: pointer.x - this.scale.width / 2,
      y: pointer.y - this.scale.height / 2,
    };
  }

  onPointerDown(pointer) {
    const v = this.pointerVecFromCenter(pointer);
    if (Math.hypot(v.x, v.y) < 30) { this.draggingState = null; return; }
    this.draggingState = { lastAngle: Math.atan2(v.y, v.x) };
  }

  onPointerMove(pointer) {
    if (!this.draggingState || !pointer.isDown) return;
    const v = this.pointerVecFromCenter(pointer);
    if (Math.hypot(v.x, v.y) < 30) return;
    const a = Math.atan2(v.y, v.x);
    let delta = a - this.draggingState.lastAngle;
    while (delta >  Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    this.tiltAngle += delta;
    this.draggingState.lastAngle = a;
    this.applyTilt();
  }

  onPointerUp() {
    this.draggingState = null;
  }

  applyTilt() {
    const G = 620;
    this.cameras.main.setRotation(this.tiltAngle);
    this.physics.world.gravity.set(
      G * Math.sin(this.tiltAngle),
      G * Math.cos(this.tiltAngle)
    );
  }
}
