import Phaser from 'phaser';

import Enums from '../enums';

export class BetState extends Phaser.State {
	constructor() {
		super();

		this.dogs = {};
		this.curDog = Enums.Dogs.KIMBO;	
	}

	create() {
		// Play background music
		this.game.playBackgroundAudio("idle_loop");

		let centerX = this.game.world.centerX;
		let titleY = 48;

		let config 	= this.game.config;
		let fontSizeTitle = config.get("fontSize.title");
		let fontSizeSubtitle = config.get("fontSize.subtitle");
		let fontSizeMenu = config.get("fontSize.menu");

		let minBet = config.get("bet.minBet");
		let maxBet = Math.min(config.get("bet.maxBet"), this.game.save.get("highscore"));
		let betSteps = config.get("bet.betSteps");

		this.curBet = Math.min(Math.floor(this.game.save.get("highscore") * 0.005) * 100, maxBet);

		// Draw title
		this.title = this.game.add.bitmapText(centerX, titleY, "fnt_va", "WETTEINSATZ", fontSizeTitle);
		this.title.anchor.setTo(0.5);

		// Draw bet change arrows
		let arrowPosY = this.title.y + 50;
		this.arrowLeft = this.game.add.bitmapText(centerX / 2, arrowPosY, "fnt_va", "<", fontSizeSubtitle);
		this.arrowLeft.hitArea = Phaser.Rectangle.inflate(Phaser.Rectangle.clone(this.arrowLeft.getLocalBounds()), 10, 10);
		this.arrowRight = this.game.add.bitmapText(centerX / 2 + centerX, arrowPosY, "fnt_va", ">", fontSizeSubtitle);
		this.arrowRight.hitArea = Phaser.Rectangle.inflate(Phaser.Rectangle.clone(this.arrowRight.getLocalBounds()), 10, 10);

		// Draw current bet
		this.bet = this.game.add.bitmapText(centerX, arrowPosY + 2, "fnt_va", this.curBet, fontSizeSubtitle);
		this.bet.anchor.setTo(0.5, 0);

		// Draw select dog text
		this.selectText = this.game.add.bitmapText(centerX, this.arrowLeft.y + 75, "fnt_va", "WÄHLE DEINEN HUND", fontSizeMenu);
		this.selectText.anchor.setTo(0.5);

		// Draw Dogs
		let dogX = centerX / 2;
		let dogY = this.selectText.y + 211;
		this.dogs[Enums.Dogs.KIMBO] = {};
		this.dogs[Enums.Dogs.KIMBO].sprite = this.game.add.sprite(dogX, dogY, "sprite-ani-won-kimbo", 1);
		this.dogs[Enums.Dogs.KIMBO].sprite.animations.add("muscle", [0, 1]);
		this.dogs[Enums.Dogs.KIMBO].sprite.anchor.setTo(0.5, 1);
		this.dogs[Enums.Dogs.KIMBO].sprite.scale.setTo(0.4);
		this.dogs[Enums.Dogs.KIMBO].sprite.inputEnabled = true;
		this.dogs[Enums.Dogs.KIMBO].sprite.events.onInputDown.add(() => {
			this.selectDog(Enums.Dogs.KIMBO);
		});

		this.dogs[Enums.Dogs.KIMBO].text = this.game.add.bitmapText(dogX, dogY + 10, "fnt_va", "KIMBO", fontSizeMenu);
		this.dogs[Enums.Dogs.KIMBO].text.anchor.setTo(0.5, 0);
		this.dogs[Enums.Dogs.KIMBO].text.visible = false;
		this.dogs[Enums.Dogs.KIMBO].text.inputEnabled = true;
		this.dogs[Enums.Dogs.KIMBO].text.events.onInputDown.add(() => {
			this.selectDog(Enums.Dogs.KIMBO);
		});

		this.dogs[Enums.Dogs.KIRBY] = {};
		this.dogs[Enums.Dogs.KIRBY].sprite = this.game.add.sprite(dogX + centerX, dogY, "sprite-ani-won-kirby", 1);
		this.dogs[Enums.Dogs.KIRBY].sprite.animations.add("muscle", [1, 0]);
		this.dogs[Enums.Dogs.KIRBY].sprite.anchor.setTo(0.5, 1);
		this.dogs[Enums.Dogs.KIRBY].sprite.scale.setTo(0.4);
		this.dogs[Enums.Dogs.KIRBY].sprite.inputEnabled = true;
		this.dogs[Enums.Dogs.KIRBY].sprite.events.onInputDown.add(() => {
			this.selectDog(Enums.Dogs.KIRBY);
		});

		this.dogs[Enums.Dogs.KIRBY].text = this.game.add.bitmapText(dogX + centerX, dogY + 10, "fnt_va", "KIRBY", fontSizeMenu);
		this.dogs[Enums.Dogs.KIRBY].text.anchor.setTo(0.5, 0);
		this.dogs[Enums.Dogs.KIRBY].text.visible = false;
		this.dogs[Enums.Dogs.KIRBY].text.inputEnabled = true;
		this.dogs[Enums.Dogs.KIRBY].text.events.onInputDown.add(() => {
			this.selectDog(Enums.Dogs.KIRBY);
		});

		// Draw OK Button
		this.ok = this.game.add.sprite(centerX, this.game.world.height - 80, "sprite-buttons", 2);
		this.ok.anchor.setTo(0.5);

		// Handle Input
		this.arrowLeft.inputEnabled = true;
		this.arrowLeft.events.onInputDown.add(() => {
			this.curBet -= betSteps;
			this.curBet = this.curBet > minBet ? this.curBet : minBet;
			this.bet.text = this.curBet;
		});
		this.arrowRight.inputEnabled = true;
		this.arrowRight.events.onInputDown.add(() => {
			this.curBet += betSteps;
			this.curBet = this.curBet > maxBet ? maxBet : this.curBet;
			this.bet.text = this.curBet;
		});
		this.ok.inputEnabled = true;
		this.ok.events.onInputDown.add(() => {
			this.game.state.start(Enums.States.PLAY, true, false, this.curDog, this.curBet);
		})

		this.selectDog(this.curDog);
	}

	selectDog(index) {
		if (index < 0 || index >= this.dogs.length) {
			return;
		}

		let dogKeys = Object.keys(this.dogs);
		for (let i = 0; i < dogKeys.length; i++) {
			this.dogs[dogKeys[i]].sprite.animations.stop("muscle");
			this.dogs[dogKeys[i]].text.visible = false;
		}

		this.dogs[index].sprite.animations.play("muscle", 4, true);
		this.dogs[index].text.visible = true;
		this.curDog = index;
	}
}