class VectorAim extends Phaser.Graphics {
    constructor(game, racer) {
        super(game, racer.x, racer.y);

        this.racer = racer;

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

        let new_accel = new Phaser.Point(this.world_mouse_coords.x - (this.x + this.racer.velocity.x),
                                         this.world_mouse_coords.y - (this.y + this.racer.velocity.y));
        this.racer.set_acceleration(new_accel);

        //TODO: this method sucks. It's not always registered :(
        if (!pointer.leftButton.isDown && this.formerMouseDown) {
            this.formerMouseDown = false;
            this.racer.move();
            this.x = this.racer.x;
            this.y = this.racer.y;
        } else {
            this.formerMouseDown = pointer.leftButton.isDown
        }

        this.render();
    }

    render() {
        this.clear();

        // circle around future position
        this.lineStyle(1, 0xffffff);
        this.beginFill(0xff0000, 0.3);
        this.drawCircle(this.racer.velocity.x, this.racer.velocity.y, this.racer.max_acceleration*2);
        this.endFill();

        // line to future position
        this.lineStyle(1, 0x00ff00);
        this.moveTo(0,0);
        this.lineTo(this.racer.velocity.x + this.racer.acceleration.x,
                    this.racer.velocity.y + this.racer.acceleration.y);
    }
}

export default VectorAim;
