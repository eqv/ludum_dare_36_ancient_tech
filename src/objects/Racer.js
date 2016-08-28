class RacerPhysics {
  constructor(x, y, racer, trackinfo) {
        this.x = x;
        this.y = y;
        this.racer = racer
        this.trackinfo = trackinfo;
        this.velocity     = new Phaser.Point(0, 0);
        this.acceleration = new Phaser.Point(0, 0);
        this.max_acceleration = 25;
        this.last_checkpoint    = new Phaser.Point(x, y);
        this.last_checkpoint_id = null;
  }

  set_acceleration(acceleration) {
      var mag = acceleration.getMagnitude();
      if (mag > this.max_acceleration) {
          acceleration.setMagnitude(this.max_acceleration);
      }
      this.acceleration = acceleration;
  }

  move() {
      let prev_pos = new Phaser.Point(this.x, this.y);

      this.velocity.add(this.acceleration.x, this.acceleration.y);
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      let cur_pos = new Phaser.Point(prev_pos.x, prev_pos.y);
      let mag = this.velocity.getMagnitude();
      let step = new Phaser.Point(this.velocity.x, this.velocity.y);
      step.setMagnitude(1.0);
      let i;
      let new_checkpoint = null;
      let new_checkpoint_id = null;
      let glitched = false;
      for (i = 0; i <= mag; i++) {
          if (i > mag) {
              cur_pos.x = this.pos.x;
              cur_pos.y = this.pos.y;
          }
          else {
              cur_pos.add(step.x, step.y);
          }

          let pixel = this.trackinfo.get_map(Math.round(cur_pos.x), Math.round(cur_pos.y));
          
          // check if we went past a checkpoint
          if (new_checkpoint == null) {
              let is_checkpoint = this.trackinfo.is_on_check_point(pixel);
              if (is_checkpoint) {
                  if (is_checkpoint != this.last_checkpoint_id) { // check only if this is a new checkpoint
                      if (this.last_checkpoint_id != null) {
                          let prev_checkpoint = this.trackinfo.checkpoints[this.trackinfo.checkpoints.length - 1].id;
                          for (let cp of this.trackinfo.checkpoints) {
                              if (cp.id == is_checkpoint && prev_checkpoint != this.last_checkpoint_id) {
                                  glitched = true;
                                  break;
                              }
                              else {
                                  prev_checkpoint = cp.id;
                              }
                          }
                      }
                      else if (is_checkpoint != this.trackinfo.checkpoints[0].id) {
                          glitched = true;
                      }
                  }
                  if (!glitched) {
                      new_checkpoint = new Phaser.Point(cur_pos.x, cur_pos.y);
                      new_checkpoint_id = is_checkpoint;
                  }
              }
          }

          // check for glitching
          if (!this.trackinfo.is_on_track(pixel) && this.last_checkpoint != null) {
              glitched = true;
          }

          if (glitched) {
              if (this.racer) {
                  this.racer.previous_positions = [];
              }
              this.x = this.last_checkpoint.x;
              this.y = this.last_checkpoint.y;
              this.velocity.x = 0.0;
              this.velocity.y = 0.0;
              glitched = true;
              break;
          }
      }
      if (!glitched && new_checkpoint != null) {
          this.last_checkpoint    = new_checkpoint;
          this.last_checkpoint_id = new_checkpoint_id;
      }
  }

  fork(){
    let res = new RacerPhysics(this.x, this.y, null, this.trackinfo)
    res.velocity = this.velocity.clone();
    res.acceleration = this.acceleration.clone();
    if(this.last_checkpoint) res.last_checkpoint = this.last_checkpoint.clone();
    res.last_checkpoint_id = this.last_checkpoint_id;
    res.max_acceleration = this.max_acceleration;
    return res
  }
}

class Racer extends Phaser.Graphics {
    constructor(game, x, y, trackinfo) {
        super(game, x, y);

        this.physics = new RacerPhysics(x, y, this, trackinfo)
        this.previous_positions = [];
        this.history_length = 7;

        this.render();
        this.game.world.add(this);
    }

    set_acceleration(accel) {
      this.physics.set_acceleration(accel)
    }

    move() {
      let prev_pos = new Phaser.Point(this.physics.x, this.physics.y);
      this.previous_positions.push(prev_pos);
      this.physics.move()
      this.x = this.physics.x
      this.y = this.physics.y
    }

    update() {
        this.x = this.physics.x;
        this.y = this.physics.y;
        this.render();
    }

    render() {
        this.clear();

        // draw stuff at our current position
        this.beginFill(0xffffff, 0.5);
        this.drawCircle(0, 0, 20);
        this.endFill();

        // the path up to here
        this.lineStyle(2, 0xffffff);
        if (this.previous_positions.length >= 1) {
            this.moveTo(0, 0);
            let last_idx = Math.max(this.previous_positions.length - this.history_length, 0);

            // paint line path
            for (var i = this.previous_positions.length; i > last_idx; i--) {
                var point_x = this.previous_positions[i-1].x - this.x;
                var point_y = this.previous_positions[i-1].y - this.y;

                this.lineTo(point_x, point_y);
            }

            // paint points on the path
            for (var i = this.previous_positions.length; i > last_idx; i--) {
                var point_x = this.previous_positions[i-1].x - this.x;
                var point_y = this.previous_positions[i-1].y - this.y;

                this.beginFill(0x00ff00);
                this.drawRect(point_x - 2, point_y - 2, 4, 4);
                this.endFill();
            }
        }
    }
}

export default Racer;
