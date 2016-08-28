class Racer extends Phaser.Graphics {
    constructor(game, x, y, trackinfo) {
        super(game, x, y);

        this.trackinfo = trackinfo;

        this.velocity     = new Phaser.Point(0, 0);
        this.acceleration = new Phaser.Point(0, 0);

        this.previous_positions = [];
        this.past_checkpoints   = [];

        this.max_acceleration = 25;
        this.history_length = 7;

        this.render();
        this.game.world.add(this);
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
        this.previous_positions.push(prev_pos);

        this.velocity.add(this.acceleration.x, this.acceleration.y);
        this.x += this.velocity.x;
        this.y += this.velocity.y;

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
                this.x = last_cp[0].x;
                this.y = last_cp[0].y;
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

    update() {
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
                var point_x = this.previous_positions[i-1].x-this.x;
                var point_y = this.previous_positions[i-1].y-this.y;

                this.lineTo(point_x, point_y);
            }

            // paint points on the path
            for (var i = this.previous_positions.length; i > last_idx; i--) {
                var point_x = this.previous_positions[i-1].x-this.x;
                var point_y = this.previous_positions[i-1].y-this.y;

                this.beginFill(0x00ff00);
                this.drawRect(point_x-2, point_y-2, 4, 4);
                this.endFill();
            }
        }
    }
}

export default Racer;
