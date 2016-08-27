class VectorAim extends Phaser.Graphics {
	constructor(game, x, y) {
		super(game, x, y);

        this.previous_positions = [];
        this.velocity = new Phaser.Point(0, 0);

        this.world_mouse_coords = new Phaser.Point(0, 0);

        this.formerMouseDown = false;

        this.fixedToCamera = false;
        this.render();

		this.game.world.add(this);
	}

    update() {
        var pointer = this.game.input.mousePointer; //activePointer;
        this.world_mouse_coords.x = pointer.worldX;
        this.world_mouse_coords.y = pointer.worldY;

        //TODO: this method sucks. It's not always registered :(
        if (!pointer.leftButton.isDown && this.formerMouseDown) {
            //A CLICK! OMG!
            console.log("CLICK!")
            this.formerMouseDown = false;

            this.previous_positions.push(new Phaser.Point(this.x, this.y));

            var velocity_change = new Phaser.Point(
                this.world_mouse_coords.x-(this.x+this.velocity.x),
                this.world_mouse_coords.y-(this.y+this.velocity.y)
            );
            
            this.velocity.x += velocity_change.x;
            this.velocity.y += velocity_change.y;

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
        this.drawCircle(0, 0, 50);
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

            // paint points
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
        this.drawCircle(this.velocity.x, this.velocity.y, 50);
        this.endFill();

        this.lineStyle(1, 0xffff00);
        //interactive mouse thingy
        this.moveTo(this.velocity.x,this.velocity.y);
        this.lineTo(this.world_mouse_coords.x-this.x, this.world_mouse_coords.y-this.y);

        this.lineStyle(3, 0x00ff00);
        this.moveTo(0,0);
        this.lineTo(this.velocity.x, this.velocity.y);
    }
}

export default VectorAim;
