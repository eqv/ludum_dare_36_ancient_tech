class VectorAim extends Phaser.Graphics {
    constructor(game, trackinfo, x, y) {
        super(game, x, y);
        this.trackinfo = trackinfo;

        this.previous_positions = [];
        this.past_checkpoints = [];
        this.velocity = new Phaser.Point(0, 0);
        this.velocity_change = new Phaser.Point(0, 0);

        // is being set in update and used in render
        this.world_mouse_coords = new Phaser.Point(0, 0);

        this.max_acceleration = 25;

        // whether the left mouse button has been pressed during the last update
        this.formerMouseDown = false;

        //this.fixedToCamera = false;
        this.render();
        this.game.world.add(this);
    }

    update() {
        var pointer = this.game.input.mousePointer; //activePointer;
        this.world_mouse_coords.x = pointer.worldX;
        this.world_mouse_coords.y = pointer.worldY;

        this.velocity_change.x = this.world_mouse_coords.x-(this.x+this.velocity.x);
        this.velocity_change.y = this.world_mouse_coords.y-(this.y+this.velocity.y);
        var mag = this.velocity_change.getMagnitude();
        if (mag > this.max_acceleration) {
            this.velocity_change.setMagnitude(this.max_acceleration);
        }

        //TODO: this method sucks. It's not always registered :(
        if (!pointer.leftButton.isDown && this.formerMouseDown) {
            //A CLICK! OMG!
            console.log("CLICK!")
            this.formerMouseDown = false;

            let prev_pos = new Phaser.Point(this.x, this.y);
            this.previous_positions.push(prev_pos);

            this.velocity.x += this.velocity_change.x;
            this.velocity.y += this.velocity_change.y;

            this.x += this.velocity.x;
            this.y += this.velocity.y;

            let pixel = this.trackinfo.get_map(Math.round(this.x), Math.round(this.y));
            if (!this.trackinfo.is_on_track(pixel) && this.past_checkpoints.length > 0) {
                let last_cp = this.past_checkpoints[this.past_checkpoints.length - 1];
                this.previous_positions = this.previous_positions.slice(0, last_cp[1]);
                this.x = last_cp[0].x;
                this.y = last_cp[0].y;
                this.velocity.x = 0.0;
                this.velocity.y = 0.0;
            }
            else {
                let cur_pos = new Phaser.Point(prev_pos.x, prev_pos.y);
                let mag = this.velocity.getMagnitude();
                let step = new Phaser.Point(this.velocity.x, this.velocity.y);
                step.setMagnitude(1.0);
                let i;
                for (i = 0; i < mag; i++) {
                    cur_pos.x += step.x;
                    cur_pos.y += step.y;
                    let pixel = this.trackinfo.get_map(Math.round(cur_pos.x), Math.round(cur_pos.y));
                    if (this.trackinfo.is_on_check_point(pixel)) {
                        this.past_checkpoints.push([cur_pos, this.previous_positions.length - 1]);
                        break;
                    }
                }
            }
        } else {
            this.formerMouseDown = pointer.leftButton.isDown
        }

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

            // paint line path
            for (var i = this.previous_positions.length; i > 0 ; i--) {
                var point_x = this.previous_positions[i-1].x-this.x;
                var point_y = this.previous_positions[i-1].y-this.y;

                this.lineTo(point_x, point_y);
            }

            // paint points on the path
            for (var i = this.previous_positions.length; i > 0 ; i--) {
                var point_x = this.previous_positions[i-1].x-this.x;
                var point_y = this.previous_positions[i-1].y-this.y;

                this.beginFill(0x00ff00);
                this.drawRect(point_x-2, point_y-2, 4, 4);
                this.endFill();
            }
        }

        // circle around future position
        this.lineStyle(1, 0xffffff);
        this.beginFill(0xff0000, 0.3);
        this.drawCircle(this.velocity.x, this.velocity.y, this.max_acceleration*2);
        this.endFill();

        // line to future position
        this.lineStyle(3, 0x00ff00);
        this.moveTo(0,0);
        this.lineTo(this.velocity.x, this.velocity.y);

        // interactive mouse thingy, cap the line at the circle radius
        this.lineStyle(1, 0xffff00);
        this.moveTo(this.velocity.x, this.velocity.y);
        this.lineTo(this.velocity.x+this.velocity_change.x, this.velocity.y+this.velocity_change.y);
    }
}

export default VectorAim;
