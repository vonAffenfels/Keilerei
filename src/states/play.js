import Phaser from 'phaser';

import Enums from '../enums';

export class PlayState extends Phaser.State {
	constructor() {
		super();
	}

	init(dog, bet) {
		this.dog = dog;
		this.bet = bet;
		this.availableCredts = this.game.save.get("highscore") - this.bet;

		let foodCosts = this.game.config.get("feedCosts");

		this.playState = Enums.PlayStates.ANIMATION;
	}

	_createStartAnimation() {
		let centerY = this.game.world.centerY;
		let centerX = this.game.world.centerX;

		// Draw Kimbo Run
		this.kimboRun = this.game.add.sprite(0, centerY + 30, "sprite-ani-run-kimbo", 0);
		this.kimboRun.animations.add("run", [0, 1, 2, 1]);
		this.kimboRun.animations.play("run", 8, true);
		this.kimboRun.scale.setTo(0.4);
		this.kimboRun.anchor.setTo(1, 0);
		this.kimboRun.runTween = this.game.add.tween(this.kimboRun);
		this.kimboRun.runTween.to({x: centerX + 40});
		this.kimboRun.runTween.start();

		// Draw Kirby Run
		this.kirbyRun = this.game.add.sprite(this.game.world.width, centerY + 30, "sprite-ani-run-kirby", 0);
		this.kirbyRun.animations.add("run", [0, 1, 2, 1]);
		this.kirbyRun.animations.play("run", 8, true);
		this.kirbyRun.scale.setTo(0.4);
		this.kirbyRun.runTween = this.game.add.tween(this.kirbyRun);
		this.kirbyRun.runTween.to({x: centerX - 40});
		this.kirbyRun.runTween.start();
		this.kirbyRun.runTween.onComplete.add(() => {
			this._destroyStartAnimation();
			this._createGameField();
		});
	}

	_winning(dog) {
		this.playState = Enums.PlayStates.WON;
		this._destroyGameField();

		this.shouldPlayGrowl = false;

		let centerX = this.game.world.centerX;
		let dogX = centerX / 2;
		let dogY = this.game.world.centerY;

		let kirby = null;
		let kimbo = null;
		let dogName = "";

		if (dog == Enums.Dogs.KIMBO) {
			kimbo = this.game.add.sprite(dogX, dogY, "sprite-ani-won-kimbo", 1);
			kimbo.animations.add("muscle", [0, 1]);
			kimbo.animations.play("muscle", 4, true);
			kimbo.anchor.setTo(0.5);
			kimbo.scale.setTo(0.4);

			kirby = this.game.add.sprite(dogX + centerX, dogY + 25, "sprite-ani-lost-kirby", 1);
			kirby.animations.add("lost", [0, 1]);
			kirby.animations.play("lost", 4, true);
			kirby.anchor.setTo(0.5);
			kirby.scale.setTo(0.4);

			dogName = "KIMBO";
		} else if (dog == Enums.Dogs.KIRBY) {
			kimbo = this.game.add.sprite(dogX, dogY + 25, "sprite-ani-lost-kimbo", 1);
			kimbo.animations.add("lost", [0, 1]);
			kimbo.animations.play("lost", 4, true);
			kimbo.anchor.setTo(0.5);
			kimbo.scale.setTo(0.4);

			kirby = this.game.add.sprite(dogX + centerX, dogY, "sprite-ani-won-kirby", 1);
			kirby.animations.add("muscle", [1, 0]);
			kirby.animations.play("muscle", 4, true);
			kirby.anchor.setTo(0.5);
			kirby.scale.setTo(0.4);

			dogName = "KIRBY";
		}

		let config 	= this.game.config;
		let fontSizeMenu = config.get("fontSize.menu");
		let fontSizeTitle = config.get("fontSize.title");

		this.game.playBackgroundAudio("idle_loop");
		this.dogsLoopAudio.stop();
		this.dogsLoopAudio.destroy();

		// Draw title
		this.title = this.game.add.bitmapText(centerX, 48, "fnt_va", dogName + " GEWINNT!", fontSizeTitle);
		this.title.anchor.setTo(0.5);

		if (dog == this.dog) {
			// User gewinnt
			this.userWin = this.game.add.bitmapText(centerX, this.title.y + fontSizeTitle / 2 + 20, "fnt_va", "DU GEWINNST " + this.bet + " CREDITS", fontSizeMenu);
			this.userWin.anchor.setTo(0.5);
			this.game.save.set("highscore", this.availableCredts + this.bet * 2);
		} else {
			this.userWin = this.game.add.bitmapText(centerX, this.title.y + fontSizeTitle / 2 + 20, "fnt_va", "DU VERLIERST", fontSizeMenu);
			this.userWin.anchor.setTo(0.5);					
		}

		// Draw OK Button
		this.ok = this.game.add.sprite(centerX, this.game.world.height - 80, "sprite-buttons", 2);
		this.ok.anchor.setTo(0.5);
		this.ok.inputEnabled = true;
		this.ok.events.onInputDown.add(() => {
			this.game.state.start(Enums.States.MENU);
		})
	}

	_updateGameField() {
		this._updateHealthBars(Enums.Dogs.KIMBO);
		this._updateHealthBars(Enums.Dogs.KIRBY);

		if (this.dogs[Enums.Dogs.KIMBO].health <= 0) {
			this._winning(Enums.Dogs.KIRBY);
		} else if (this.dogs[Enums.Dogs.KIRBY].health <= 0) {
			this._winning(Enums.Dogs.KIMBO);
		}
	}

	_updateHealthBars(dog) {
		let startX = 3;
		let width = 62;

		let dogPerc = this.dogs[dog].health / 100;
		let barWidth = width * dogPerc;
		this.dogs[dog].healthBar.bar.clear();
		this.dogs[dog].healthBar.bar.beginFill(0xFFFFFF);
		this.dogs[dog].healthBar.bar.drawRect(barWidth + startX, 3, width - barWidth, 5);
		this.dogs[dog].healthBar.bar.endFill();
	}

	_destroyGameField() {
		this.dogs[Enums.Dogs.KIMBO].healthBar.bar.destroy();
		this.dogs[Enums.Dogs.KIMBO].healthBar.destroy();
		this.dogs[Enums.Dogs.KIMBO].timer.stop();
		this.dogs[Enums.Dogs.KIMBO].timer.destroy();

		this.dogs[Enums.Dogs.KIRBY].healthBar.bar.destroy();
		this.dogs[Enums.Dogs.KIRBY].healthBar.destroy();
		this.dogs[Enums.Dogs.KIRBY].timer.stop();
		this.dogs[Enums.Dogs.KIRBY].timer.destroy();

		this.feedButton.destroy();

		this.cloud.destroy();
		this.cloudDogs.destroy();

		this.credits.destroy();
		this.curBet.destroy();
	}

	_feedDog(dog) {
		let feedCosts = this.game.config.get("feedCosts");
		let newVal = this.availableCredts - feedCosts;
		this.availableCredts = newVal;
		this.credits.text = "CREDITS: " + this.availableCredts;

		let feedValue = this.game.config.get("feedValue");
		this.dogs[dog].health = Math.min(100, this.dogs[dog].health + feedValue);

		let startX = 0;
		let startY = this.game.world.centerY - 180;
		let align = 0;
		if (dog == Enums.Dogs.KIMBO) {
			startX = this.game.world.centerX - 150;
		} else if (dog == Enums.Dogs.KIRBY) {
			startX = this.game.world.centerX + 150;
			align = 1;
		}

		let buffSprite = this.game.add.sprite(startX, startY, "icon-plus-meat");
		buffSprite.anchor.setTo(align, 1);

		let buffTween = this.game.add.tween(buffSprite);
		buffTween.to({y: startY - 50, alpha: 0});
		buffTween.onComplete.add(() => {
			buffSprite.destroy();
		});
		buffTween.start();

		this.powerUpAudio.play();
	}

	_createGameField() {
		let config = this.game.config;

		this.playState = Enums.PlayStates.FIGHT;

		this.dogs = {};
		this.dogs[Enums.Dogs.KIMBO] = {health: 100};
		this.dogs[Enums.Dogs.KIRBY] = {health: 100};

		let centerY = this.game.world.centerY;
		let centerX = this.game.world.centerX;

		this.cloud = this.game.add.sprite(centerX, centerY, "sprite-cloud-blank", 0);
		this.cloud.animations.add("cloud", [0, 1, 2, 3, 4, 5, 6, 7]);
		this.cloud.anchor.setTo(0.5);
		this.cloud.scale.setTo(0.6);
		this.cloud.animations.play("cloud", 12, true);

		this.cloudDogs = this.game.add.sprite(centerX, centerY, "sprite-cloud-dogs", 0);
		this.cloudDogs.animations.add("cloudDogs", [0, 1, 2, 3, 4, 5, 6, 7]);
		this.cloudDogs.anchor.setTo(0.5);
		this.cloudDogs.scale.setTo(0.6);
		this.cloudDogs.animations.play("cloudDogs", 12, true);

		let kimboBar = this.game.add.sprite(centerX - 150, centerY - 180, "progress-kimbo");
		kimboBar.scale.setTo(0.6);
		kimboBar.bar = this.game.add.graphics(0, 0);
		kimboBar.bar.alignTo(kimboBar, Phaser.TOP_LEFT, -26, -16);

		let kirbyBar = this.game.add.sprite(centerX + 150, centerY - 180, "progress-kirby");
		kirbyBar.scale.setTo(0.6);
		kirbyBar.anchor.setTo(1, 0);
		kirbyBar.bar = this.game.add.graphics(0, 0);
		kirbyBar.bar.alignTo(kirbyBar, Phaser.TOP_LEFT, -26, -16);

		this.feedButton = this.game.add.sprite(centerX, this.game.world.height - 80, "sprite-buttons", 1);
		this.feedButton.anchor.setTo(0.5);
		this.feedButton.inputEnabled = true;
		this.feedButton.events.onInputDown.add(() => {
			this._feedDog(this.shownDog);
		});
		this.feedButton.visible = false;
		this.feedButton.scale.setTo(0.7);
		this.shownDog = null;

		this.dogs[Enums.Dogs.KIMBO].healthBar = kimboBar;
		this.dogs[Enums.Dogs.KIRBY].healthBar = kirbyBar;

		let kimboTimer = this.game.time.create(false);
		kimboTimer.loop(config.get("dogs." + Enums.Dogs.KIMBO + ".attackSpeed"), () => {
			this._hit(Enums.Dogs.KIMBO);
		});
		kimboTimer.start();

		let kirbyTimer = this.game.time.create(false);
		kirbyTimer.loop(config.get("dogs." + Enums.Dogs.KIRBY + ".attackSpeed"), () => {
			this._hit(Enums.Dogs.KIRBY);
		});
		kirbyTimer.start();

		this.dogs[Enums.Dogs.KIMBO].timer = kimboTimer;
		this.dogs[Enums.Dogs.KIRBY].timer = kirbyTimer;

		this.dogArray = [Enums.Dogs.KIMBO, Enums.Dogs.KIRBY];

		this.dogs[Enums.Dogs.KIMBO].cloudFrame = 0;
		this.dogs[Enums.Dogs.KIRBY].cloudFrame = 4;

		this.dogSelectTimer = this.game.time.create(false);
		this.dogSelectTimer.loop(2000, () => {
			let dog = Phaser.ArrayUtils.getRandomItem(this.dogArray);
			this.shownDog = dog;
			this.cloudDogs.animations.stop("cloudDogs");
			this.cloudDogs.frame = this.dogs[dog].cloudFrame;

			this.feedButton.visible = true;

			let dogFinishSelectTimer = this.game.time.create(false);
			dogFinishSelectTimer.add(500, () => {
				this.cloudDogs.animations.play("cloudDogs");
				this.feedButton.visible = false;
			});

			dogFinishSelectTimer.start();
		});
		this.dogSelectTimer.start();

		this.shouldPlayGrowl = true;
		this._playRandomGrowl();
	}

	_getOpponent(dog) {
		if (dog == Enums.Dogs.KIMBO) {
			return Enums.Dogs.KIRBY;
		} else if (dog == Enums.Dogs.KIRBY) {
			return Enums.Dogs.KIMBO;
		}

		return null;
	}

	_hit(dog) {
		let config = this.game.config;
		let opponent = this._getOpponent(dog);

		let baseDmg = config.get("dogs." + dog + ".baseDmg");
		let hitChance = config.get("dogs." + dog + ".hitChance");
		let critChance = config.get("dogs." + dog + ".critChance");

		let hitRnd = this.game.rnd.frac();
		if (hitRnd - hitChance > 0) {
			// No hit
			return;
		}

		let hitAudio = Phaser.ArrayUtils.getRandomItem(this.hitAudio.filter(v => v.isDecoded));
		if (hitAudio) {
			hitAudio.play();
		}

		let isCrit = false;
		let critRnd = this.game.rnd.frac();
		if (critRnd - critChance < 0) {
			isCrit = true;
			baseDmg *= 2;
		}

		this.dogs[opponent].health = Math.max(this.dogs[opponent].health - baseDmg, 0);

		let centerX = this.game.world.centerX;
		let centerY = this.game.world.centerY;

		let startX = 0;
		if (dog == Enums.Dogs.KIMBO) {
			startX = this.game.rnd.integerInRange(centerX - 140, centerX);
		} else if (dog == Enums.Dogs.KIRBY) {
			startX = this.game.rnd.integerInRange(centerX, centerX + 140);
		}
		let startY = this.game.rnd.integerInRange(centerY - 120, centerY + 120);		

		let alert = this.game.add.sprite(startX, startY, "sprite-alerts", isCrit ? 4 : this.game.rnd.integerInRange(0, 3));
		alert.anchor.setTo(0.5);
		alert.scale.setTo(0.5);

		let alertTween = this.game.add.tween(alert);
		alertTween.to({alpha: 0}, 500);
		alertTween.onComplete.add(() => {
			alert.destroy();
		});
		alertTween.start();
	}


	_destroyStartAnimation() {
		this.kimboRun.destroy();
		this.kirbyRun.destroy();
		this.kimboRun = null;
		this.kirbyRun = null;
	}

	create() {
		let centerX = this.game.world.centerX;
		let titleY = 48;

		this.shouldPlayGrowl = false;

		this.game.playBackgroundAudio("fight_loop");
		this.dogsLoopAudio = this.game.add.audio("dogs_loop", 1, true);
		this.dogsLoopAudio.onDecoded.add(() => {
			this.dogsLoopAudio.play();
		});

		this.powerUpAudio = this.game.add.audio("power_up");

		this.hitAudio = [];
		for (let i = 1; i <= 14; i++) {
			this.hitAudio[i] = this.game.add.audio("punch_" + i);
		}

		this.growlAudio = [];
		for (let i = 1; i <= 8; i++) {
			this.growlAudio[i] = this.game.add.audio("dog_growl_" + i);
		}

		let config 	= this.game.config;
		let fontSizeMenu = config.get("fontSize.menu");

		// Draw current bet
		this.curBet = this.game.add.bitmapText(centerX, titleY, "fnt_va", "WETTEINSATZ: " + this.bet, fontSizeMenu);
		this.curBet.anchor.setTo(0.5);

		// Draw current credits
		this.credits = this.game.add.bitmapText(centerX, titleY + fontSizeMenu / 2 + 10, "fnt_va", "CREDITS: " + this.availableCredts, fontSizeMenu);
		this.credits.anchor.setTo(0.5);

		this._createStartAnimation();
	}

	update() {
		if (this.playState == Enums.PlayStates.FIGHT) {
			this._updateGameField();
		}
	}

	_playRandomGrowl() {
		if (!this.shouldPlayGrowl) {
			return;
		}

		let growlAudio = Phaser.ArrayUtils.getRandomItem(this.growlAudio.filter(v => v.isDecoded));
		growlAudio.play();
		growlAudio.onStop.addOnce(() => {
			setTimeout(() => {
				this._playRandomGrowl();
			}, 1000);
		});
	}
}