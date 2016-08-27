import RainbowText from 'objects/RainbowText';

class RaceState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let text = new RainbowText(this.game, center.x, center.y, "- fnord2 -\nwith a sprinkle of\nES6 dust!");
    //let trackinfo = new Trackinfo(this.game)
		text.anchor.set(0.5);
	}

}

export default RaceState;
