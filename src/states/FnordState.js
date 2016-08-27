import RainbowText from 'objects/RainbowText';
import VectorAim from 'objects/VectorAim';

class FnordState extends Phaser.State {

	create() {
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }

		//let text = new RainbowText(this.game, center.x, center.y, "- the game -\n\nUncontrollable\nHeavenly\nSpeedboats!");
		//text.anchor.set(0.5);

		let aim = new VectorAim(this.game, center.x, center.y);
	}

}

export default FnordState;
