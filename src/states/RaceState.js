import TrackInfo from 'objects/TrackInfo';
import VectorAim from 'objects/VectorAim';

class RaceState extends Phaser.State {

    create() {
        this.game.stage.backgroundColor = '#124184';

        this.game.world.setBounds(0, 0, 2000, 2000);
		let center = { x: this.game.world.centerX, y: this.game.world.centerY }

        let trackinfo = new TrackInfo(this.game, "track1")
        this.cursors = this.game.input.keyboard.createCursorKeys();

		let aim = new VectorAim(this.game, 100, 100);
	}

    update() {
        if (this.cursors.up.isDown)
        {
            this.game.camera.y -= 4;
        }
        else if (this.cursors.down.isDown)
        {
            this.game.camera.y += 4;
        }

        if (this.cursors.left.isDown)
        {
            this.game.camera.x -= 4;
        }
        else if (this.cursors.right.isDown)
        {
            this.game.camera.x += 4;
        }

    }

}

export default RaceState;
