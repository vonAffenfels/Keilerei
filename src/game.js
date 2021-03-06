import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Api from "adventskalender-js-api";

import Enums from './enums';
import GameSave from './save';
import GameConfig from './config';
import * as States from './states';

class Game extends Phaser.Game {
	constructor() {
		let config = new GameConfig();
		super(config.get("game"));

		this.config = config;

		this.api = new Api();
		this.api.init(window, this.config.get("game.name"));
		
		this.save = new GameSave(this);
		this.orientated = true;

		for (let stateName in Enums.States) {
			let state = Enums.States[stateName]
			this.state.add(state, States[state]);
		}

		this.state.start(this.config.get("defaultState"));
	}

	onEnterIncorrectOrientation() {
		this.orientated = false;
		document.getElementById('orientation').style.display = 'block';
	}

	onLeaveIncorrectOrientation() {
		this.orientated = false;
		document.getElementById('orientation').style.display = 'none';
	}

	playBackgroundAudio(key) {
		if (this._currentAudio == key) {
			return;
		}

		if (this._backgroundAudio) {
			this._backgroundAudio.stop();
			this._backgroundAudio.destroy();
		}

		this._currentAudio = key;
		this._backgroundAudio = this.add.audio(key, 1, true);
		this._backgroundAudio.onDecoded.add(() => {
			this._backgroundAudio.play();
		});
	}
}

window.Game = Game;