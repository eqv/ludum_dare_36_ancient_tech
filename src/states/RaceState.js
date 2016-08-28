import Racer from 'objects/Racer';
import TrackInfoExtractor from 'objects/TrackInfoExtractor';
import VectorAim from 'objects/VectorAim';
import MonteCarloAI from 'objects/MonteCarloAI.js';

let tracks = [
  {
    name: "track1", 
    num_points: 30,
    buffer: null,
  }
]

class RaceState extends Phaser.State {
    init(pvp) {
        this.pvp = pvp
    }

    create() {
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.stage.backgroundColor = '#124184';
        let center = { x: this.game.world.centerX, y: this.game.world.centerY };
        this.trackinfo = new TrackInfoExtractor(this.game, tracks[0]);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.world.setBounds(0, 0, 2000, 2000);
        this.players = [];

        let start = this.find_random_starting_point();
        let racer = new Racer(this.game, start.x, start.y, this.trackinfo);
        let aim = new VectorAim(this.game, racer);
        this.players.push(aim);

        if (this.pvp) {
          start = this.find_random_starting_point();
          racer = new Racer(this.game, start.x, start.y, this.trackinfo);
          aim = new VectorAim(this.game, racer);
          aim.alive = false;
          this.players.push(aim);
        }
        else {
          let airacer = new Racer(this.game, start.x, start.y, this.trackinfo);
          this.ai = new MonteCarloAI(this.game, airacer,this.trackinfo);
          this.ai.decide(100,5);
          this.ai.alive = false;
          this.players.push(this.ai);
        }
    }

    find_random_starting_point() {
        let idx = Math.floor(Math.random() * this.trackinfo.finish_points.length);
        return this.trackinfo.finish_points[idx];
    }

    next_player() {
        let activate = false;
        for (let p of this.players) {
            if (p.alive) {
                p.alive = false;
                activate = true;
            }
            else if (activate) {
                p.alive = true;
                activate = false;
            }
        }
        if (activate) {
            this.players[0].alive = true;
        }
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
      if(this.ai)this.ai.debug_render()
    }

}

export default RaceState;
