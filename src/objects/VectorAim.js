class VectorAim extends Phaser.Graphics {
    constructor(game, player) {
        super(game, player.pos.x, player.pos.y);

        this.player = player;
        this.x = this.player.pos.x;
        this.y = this.player.pos.y;

        // is being set in update and used in render
        this.world_mouse_coords = new Phaser.Point(0, 0);

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

        let new_accel = new Phaser.Point(this.world_mouse_coords.x - (this.x + this.player.velocity.x),
                                         this.world_mouse_coords.y - (this.y + this.player.velocity.y));
        this.player.set_acceleration(new_accel);

        //TODO: this method sucks. It's not always registered :(
        if (!pointer.leftButton.isDown && this.formerMouseDown) {
            this.formerMouseDown = false;
            this.player.move();
            this.x = this.player.pos.x;
            this.y = this.player.pos.y;
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
        if (this.player.previous_positions.length >= 1) {
            this.moveTo(0, 0);

            // paint line path
            for (var i = this.player.previous_positions.length; i > 0; i--) {
                var point_x = this.player.previous_positions[i-1].x-this.x;
                var point_y = this.player.previous_positions[i-1].y-this.y;

                this.lineTo(point_x, point_y);
            }

            // paint points on the path
            for (var i = this.player.previous_positions.length; i > 0; i--) {
                var point_x = this.player.previous_positions[i-1].x-this.x;
                var point_y = this.player.previous_positions[i-1].y-this.y;

                this.beginFill(0x00ff00);
                this.drawRect(point_x-2, point_y-2, 4, 4);
                this.endFill();
            }
        }

        // circle around future position
        this.lineStyle(1, 0xffffff);
        this.beginFill(0xff0000, 0.3);
        this.drawCircle(this.player.velocity.x, this.player.velocity.y, this.player.max_acceleration*2);
        this.endFill();

        // line to future position
        this.lineStyle(3, 0x00ff00);
        this.moveTo(0,0);
        this.lineTo(this.player.velocity.x, this.player.velocity.y);

        // interactive mouse thingy, cap the line at the circle radius
        this.lineStyle(1, 0xffff00);
        this.moveTo(this.player.velocity.x, this.player.velocity.y);
        this.lineTo(this.player.velocity.x + this.player.acceleration.x,
                    this.player.velocity.y + this.player.acceleration.y);
    }
}

export default VectorAim;
