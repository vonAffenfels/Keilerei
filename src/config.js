import Phaser from 'phaser';

import Enums from './enums';

export default class GameConfig {
	constructor() {
		this._data = {
			game: {
				baseWidth: 320,
				baseHeight: 568,
				maxWidth: 768,
				width: "100%",
				height: "100%",
				enableDebug: false,
				backgroundColor: '#FFFFFF',
				renderer: Phaser.CANVAS,
				name: "Keilerei"
			},

			fontSize: {
				title: 			48,
				subtitle: 		32, 
				menu: 			20,
			},

			bet: {
				maxBet: 100000,
				minBet: 100,
				betSteps: 100
			},

			feedCooldown: 		2000,
			feedDuration: 		750,
			feedChance: 		0.5,
			opponentFeedChance: 0.2,
			feedValue: 			15, 
			opponentFeedValue:  10,
			feedCosts: 			100,

			dogs: 				{},

			defaultState: 		Enums.States.BOOT
		};

		this._data.dogs[Enums.Dogs.KIMBO] = {
			/*baseDmg: 3,
			critChance: 0.5,
			hitChance: 0.8,
			attackSpeed: 750*/

			baseDmg: 2,
			critChance: 0.5,
			hitChance: 1,
			attackSpeed: 500
		};

		this._data.dogs[Enums.Dogs.KIRBY] = {
			/*baseDmg: 2,
			critChance: 0.5,
			hitChance: 0.8,
			attackSpeed: 500*/

			baseDmg: 2,
			critChance: 0.5,
			hitChance: 1,
			attackSpeed: 500
		};
	}

	get(key, def) {
		let keys = key.split(".");

		let curVal = this._data;
		while (keys.length > 0) {
			let curKey = keys.shift();
			if (!curVal.hasOwnProperty(curKey)) {
				return def;
			}

			curVal = curVal[curKey];
		}

		return curVal;
	}
}