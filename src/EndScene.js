class EndScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.cameras.main.fadeIn(380, 0, 0, 0);

    this.add.tileSprite(0, 0, W, H, "bg").setOrigin(0, 0);

    for (let i = 0; i < 24; i++) {
      const s = this.add.image(
        Phaser.Math.Between(40, W - 40), H + 20, "spark"
      ).setScale(Phaser.Math.FloatBetween(0.6, 1.2));
      this.tweens.add({
        targets: s,
        y: -40,
        alpha: { from: 1, to: 0 },
        duration: Phaser.Math.Between(2400, 4200),
        delay: i * 90,
        repeat: -1,
        ease: "sine.out",
      });
    }

    this.add.text(W / 2, 80, "all clear!", {
      fontFamily: "ui-monospace, monospace",
      fontSize: "48px",
      color: "#ffd166",
      stroke: "#3b2a08",
      strokeThickness: 4,
    }).setOrigin(0.5);

    const colX = [W / 2 - 220, W / 2, W / 2 + 220];
    const labels = ["level 1", "level 2", "level 3"];

    for (let i = 0; i < 3; i++) {
      const x = colX[i];
      const stats = RUN.perLevel[i] || { timeMs: 0, deaths: 0 };
      const m  = Math.floor(stats.timeMs / 60000);
      const sec = Math.floor((stats.timeMs % 60000) / 1000);
      const cs = Math.floor((stats.timeMs % 1000) / 10);
      const t = String(m).padStart(2,"0") + ":" + String(sec).padStart(2,"0") + "." + String(cs).padStart(2,"0");

      this.add.text(x, 180, labels[i], {
        fontFamily: "ui-monospace, monospace",
        fontSize: "18px",
        color: "#a89cd8",
      }).setOrigin(0.5);

      this.add.text(x, 230, t, {
        fontFamily: "ui-monospace, monospace",
        fontSize: "26px",
        color: "#e5deff",
      }).setOrigin(0.5);

      this.add.text(x, 272, stats.deaths + " deaths", {
        fontFamily: "ui-monospace, monospace",
        fontSize: "16px",
        color: "#ff8b8b",
      }).setOrigin(0.5);
    }

    this.add.line(W / 2, 340, -W / 2 + 60, 0, W / 2 - 60, 0, 0x4a3a6a).setLineWidth(1);

    const tm = Math.floor(RUN.totalTimeMs / 60000);
    const ts = Math.floor((RUN.totalTimeMs % 60000) / 1000);
    const tc = Math.floor((RUN.totalTimeMs % 1000) / 10);
    const totalT = String(tm).padStart(2,"0") + ":" + String(ts).padStart(2,"0") + "." + String(tc).padStart(2,"0");

    this.add.text(W / 2 - 100, 390, "total time", {
      fontFamily: "ui-monospace, monospace",
      fontSize: "16px",
      color: "#a89cd8",
    }).setOrigin(0.5);

    this.add.text(W / 2 - 100, 430, totalT, {
      fontFamily: "ui-monospace, monospace",
      fontSize: "28px",
      color: "#e5deff",
    }).setOrigin(0.5);

    this.add.text(W / 2 + 100, 390, "total deaths", {
      fontFamily: "ui-monospace, monospace",
      fontSize: "16px",
      color: "#a89cd8",
    }).setOrigin(0.5);

    this.add.text(W / 2 + 100, 430, String(RUN.totalDeaths), {
      fontFamily: "ui-monospace, monospace",
      fontSize: "28px",
      color: "#ff8b8b",
    }).setOrigin(0.5);

    const btn = this.add.text(W / 2, H - 60, "[ play again ]", {
      fontFamily: "ui-monospace, monospace",
      fontSize: "22px",
      color: "#ffd166",
      backgroundColor: "#3a2a08",
      padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerdown", () => {
      this.cameras.main.fadeOut(260, 0, 0, 0);
      this.time.delayedCall(280, () => this.scene.start("MenuScene"));
    });
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("MenuScene"));
  }
}
