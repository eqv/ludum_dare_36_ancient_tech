import FnordState from 'states/FnordState';
import RaceState from 'states/RaceState';
import PreloadState from 'states/PreloadState';

class CGame extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
		this.state.add('PreloadState', PreloadState, false);
		this.state.add('MainMenuState', FnordState, false);
		this.state.add('RaceState', RaceState, false);
		this.state.start('PreloadState');
	}

}

new CGame();
