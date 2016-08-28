class VectorAim extends Phaser.Graphics {
    constructor(game, x, y) {
        super(game, x, y);

        this.previous_positions = [];
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

            this.previous_positions.push(new Phaser.Point(this.x, this.y));

            this.velocity.x += this.velocity_change.x;
            this.velocity.y += this.velocity_change.y;

            this.x += this.velocity.x;
            this.y += this.velocity.y;
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
