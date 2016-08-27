import GameState from 'states/GameState';
import TrackState from 'states/TrackState';

function preload(){
  alert(1);
}

class Game extends Phaser.Game {


	constructor() {
		super(500, 500, Phaser.AUTO, 'content', null, {preload: preload});
		this.state.add('TrackState', TrackState, false);
		this.state.start('TrackState');
	}


}

new Game();
