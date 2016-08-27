import TrackInfo from 'objects/TrackInfo';

class RaceState extends Phaser.State {

	create() {
    this.game.stage.backgroundColor = '#124184';
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
    let trackinfo = new TrackInfo(this.game, "track1")
	}

}

export default RaceState;
