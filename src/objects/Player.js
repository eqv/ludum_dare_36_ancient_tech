class Player {
    constructor(trackinfo, pos) {
        this.trackinfo = trackinfo;

        this.pos          = pos;
        this.velocity     = new Phaser.Point(0, 0);
        this.acceleration = new Phaser.Point(0, 0);

        this.previous_positions = [];
        this.past_checkpoints   = [];

        this.max_acceleration = 25;
    }

    set_acceleration(acceleration) {
        var mag = acceleration.getMagnitude();
        if (mag > this.max_acceleration) {
            acceleration.setMagnitude(this.max_acceleration);
        }
        this.acceleration = acceleration;
    }

    move() {
        let prev_pos = new Phaser.Point(this.pos.x, this.pos.y);
        this.previous_positions.push(prev_pos);

        this.velocity.add(this.acceleration.x, this.acceleration.y);
        this.pos.add(this.velocity.x, this.velocity.y);

        let cur_pos = new Phaser.Point(prev_pos.x, prev_pos.y);
        let mag = this.velocity.getMagnitude();
        let step = new Phaser.Point(this.velocity.x, this.velocity.y);
        step.setMagnitude(1.0);
        let i;
        let new_checkpoint = null;
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
            if (new_checkpoint == null && this.trackinfo.is_on_check_point(pixel)) {
                new_checkpoint = [new Phaser.Point(cur_pos.x, cur_pos.y), this.previous_positions.length - 1];
                console.log('checkpoint');
            }

            // check for glitching
            if (!this.trackinfo.is_on_track(pixel) && this.past_checkpoints.length > 0) {
                let last_cp = this.past_checkpoints[this.past_checkpoints.length - 1];
                this.previous_positions = this.previous_positions.slice(0, last_cp[1]);
                this.pos.x = last_cp[0].x;
                this.pos.y = last_cp[0].y;
                this.velocity.x = 0.0;
                this.velocity.y = 0.0;
                glitched = true;
                break;
            }
        }
        if (!glitched && new_checkpoint != null) {
            this.past_checkpoints.push(new_checkpoint);
        }
    }
}

export default Player;
