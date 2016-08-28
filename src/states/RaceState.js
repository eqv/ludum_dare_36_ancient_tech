import Racer from 'objects/Racer';
import TrackInfoExtractor from 'objects/TrackInfoExtractor';
import VectorAim from 'objects/VectorAim';

let tracks = [
  {
    name: "track1", 
    num_points: 30,
    buffer: null,
  }
]

class RaceState extends Phaser.State {

    create() {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.stage.backgroundColor = '#124184';
        let center = { x: this.game.world.centerX, y: this.game.world.centerY };
        this.trackinfo = new TrackInfoExtractor(this.game, tracks[0]);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.world.setBounds(0, 0, 2000, 2000);
        let start = this.find_random_starting_point();
        let racer = new Racer(this.game, start.x, start.y, this.trackinfo);
        let aim = new VectorAim(this.game, racer);
    }

    find_random_starting_point() {
        let idx = Math.floor(Math.random() * this.trackinfo.finish_points.length);
        return this.trackinfo.finish_points[idx];
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

    render(){
      this.trackinfo.debug_render();
    }

}

export default RaceState;
