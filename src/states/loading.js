import Phaser from 'phaser';

import Enums from '../enums';

export class LoadingState extends Phaser.State {
	constructor() {
		super();
	}

	preload() {
	    let loadingBar = this.add.sprite(this.world.centerX, this.world.centerY, "loading");
	    loadingBar.anchor.setTo(0.5,0.5);
	    this.load.setPreloadSprite(loadingBar);
	    
		this.load.bitmapFont("fnt_va", 'assets/fonts/fnt_va.png', 'assets/fonts/fnt_va.fnt');

		this.game.load.spritesheet("sprite-ani-won-kimbo", "assets/images/sprite-ani-won-kimbo-299x391.png", 299, 391, 2);
		this.game.load.spritesheet("sprite-ani-lost-kimbo", "assets/images/sprite-ani-lost-kimbo-439x274.png", 439, 274, 2);
		this.game.load.spritesheet("sprite-ani-run-kimbo", "assets/images/sprite-ani-run-kimbo-380x178.png", 380, 178, 3);
		this.game.load.image("progress-kimbo", "assets/images/progress-kimbo.png");

		this.game.load.spritesheet("sprite-ani-won-kirby", "assets/images/sprite-ani-won-kirby-299x391.png", 299, 391, 2);
		this.game.load.spritesheet("sprite-ani-lost-kirby", "assets/images/sprite-ani-lost-kirby-439x274.png", 439, 274, 2);
		this.game.load.spritesheet("sprite-ani-run-kirby", "assets/images/sprite-ani-run-kirby-380x178.png", 380, 178, 3);
		this.game.load.image("progress-kirby", "assets/images/progress-kirby.png");

		this.game.load.spritesheet("sprite-buttons", "assets/images/sprite-buttons-108x108.png", 108, 108, 4);
		this.game.load.spritesheet("sprite-cloud", "assets/images/sprite-cloud-547x559.png", 547, 559, 8);
		this.game.load.spritesheet("sprite-alerts", "assets/images/sprite-alerts-234x169.png", 234, 169, 5);
		this.game.load.image("icon-plus-meat", "assets/images/icon-plus-meat.png");
	}

	create() {
		// set a blue color for the background of the stage
		this.game.stage.backgroundColor = this.game.config.get("game.backgroundColor");

		this.game.save.loadHighscore().then(() => {
			this.game.state.start(Enums.States.MENU);
		});	
	}
}