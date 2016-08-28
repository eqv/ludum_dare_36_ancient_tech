import MenuState    from 'states/MenuState';
import PreloadState from 'states/PreloadState';
import RaceState    from 'states/RaceState';
import ResultState  from 'states/ResultState';

class CGame extends Phaser.Game {

	constructor() {
		super(800, 600, Phaser.AUTO, 'content', null);
		this.state.add('PreloadState', PreloadState, false);
		this.state.add('MenuState', MenuState, false);
		this.state.add('RaceState', RaceState, false);
		this.state.add('ResultState', ResultState, false);
		this.state.start('PreloadState');
	}

}

new CGame();
