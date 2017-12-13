import Phaser from 'phaser';

import Enums from '../enums';

export class MenuState extends Phaser.State {
	constructor() {
		super();
	}

	create() {
		let centerX = this.game.world.centerX;
		let titleY = 48;

		// Play background music
		this.game.playBackgroundAudio("idle_loop");

		let highscore = this.game.save.get("highscore");
		if (highscore < 100) {
			highscore = 1000;
			this.game.save.set("highscore", 1000);
		}

		let config 	= this.game.config;
		let fontSizeTitle = config.get("fontSize.title");
		let fontSizeSubtitle = config.get("fontSize.subtitle");
		let fontSizeMenu = config.get("fontSize.menu");

		// Draw title
		this.title = this.game.add.bitmapText(centerX, titleY, "fnt_va", "KEILEREI", fontSizeTitle);
		this.title.anchor.setTo(0.5);

		// Draw Subtitle 1
		this.subtitle1 = this.game.add.bitmapText(centerX, this.title.y + fontSizeTitle, "fnt_va", "BEI", fontSizeSubtitle);
		this.subtitle1.anchor.setTo(0.5);

		// Draw Subtitle 2
		this.subtitle2 = this.game.add.bitmapText(centerX, this.subtitle1.y + fontSizeSubtitle, "fnt_va", "VON AFFENFELS", fontSizeSubtitle);
		this.subtitle2.anchor.setTo(0.5);

		// Draw Highscore
		this.highscore = this.game.add.bitmapText(centerX, this.subtitle2.y + 40, "fnt_va", "CREDITS: " + highscore, fontSizeMenu);
		this.highscore.anchor.setTo(0.5);

		// Draw Kimbo
		this.kimbo = this.game.add.sprite(centerX / 2, this.highscore.y + 216, "sprite-ani-won-kimbo", 1);
		this.kimbo.animations.add("muscle", [0, 1]);
		this.kimbo.animations.play("muscle", 4, true);
		this.kimbo.anchor.setTo(0.5, 1);
		this.kimbo.scale.setTo(0.4);

		// Draw Kirby
		this.kirby = this.game.add.sprite(centerX / 2 + centerX, this.highscore.y + 216, "sprite-ani-won-kirby", 1);
		this.kirby.animations.add("muscle", [1, 0]);
		this.kirby.animations.play("muscle", 4, true);
		this.kirby.anchor.setTo(0.5, 1);
		this.kirby.scale.setTo(0.4);

		// Draw Start Button
		this.start = this.game.add.sprite(centerX, this.game.world.height - 80, "sprite-buttons", 0);
		this.start.anchor.setTo(0.5);
		this.start.inputEnabled = true;
		this.start.events.onInputDown.add(() => {
			this.game.state.start(Enums.States.BET);
		});
	}
}