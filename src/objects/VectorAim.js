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
        if (!this.alive) {
            this.clear();
            return;
        }

        var pointer = this.game.input.mousePointer; //activePointer;
        this.world_mouse_coords.x = pointer.worldX;
        this.world_mouse_coords.y = pointer.worldY;

        let new_accel = new Phaser.Point(this.world_mouse_coords.x - (this.x + this.racer.physics.velocity.x),
                                         this.world_mouse_coords.y - (this.y + this.racer.physics.velocity.y));
        this.racer.set_acceleration(new_accel);

        //TODO: this method sucks. It's not always registered :(
        if (!pointer.leftButton.isDown && this.formerMouseDown) {
            this.formerMouseDown = false;
            this.racer.move();
            this.x = this.racer.x;
            this.y = this.racer.y;
            this.game.state.states.RaceState.next_player();
            this.clear();
            return
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
        this.drawCircle(this.racer.physics.velocity.x, this.racer.physics.velocity.y, this.racer.physics.max_acceleration*2);
        this.endFill();

        // line to future position
        this.lineStyle(1, 0x00ff00);
        this.moveTo(0,0);
        this.lineTo(this.racer.physics.velocity.x + this.racer.physics.acceleration.x,
                    this.racer.physics.velocity.y + this.racer.physics.acceleration.y);
    }
}

export default VectorAim;
