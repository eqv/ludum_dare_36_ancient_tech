class VectorAim extends Phaser.Graphics {
	constructor(game, x, y) {
		super(game, x, y);

        //this._points = [];
        this.world_mouse_coords = new Phaser.Point(0, 0);
        //this._points.push(p0);

        this.fixedToCamera = false;
        this.render();

		this.game.world.add(this);
	}

    update() {
        var pointer = this.game.input.mousePointer; //activePointer;
        this.world_mouse_coords.x = pointer.worldX;
        this.world_mouse_coords.y = pointer.worldY;
        this.render();
    }

    render() {
        this.clear();

        var world_object_coords = new Phaser.Point(this.x, this.y);
        var world_line_end = new Phaser.Point(0,0);
        //if Phaser.Point.distance(world_object_coords, this.world_object_coords

        this.lineStyle(1, 0xffff00);

        this.beginFill(0xff0000);
        this.drawCircle(0, 0, 100);
        this.endFill();

        this.lineStyle(1, 0xffff00);
        this.moveTo(0,0);
        this.lineTo(this.world_mouse_coords.x-object_x, this.world_mouse_coords.y-object_y);

        this.beginFill(0xffff00);
        this.drawRect(0-2, 0-2, 4, 4);
        this.endFill();

        this.beginFill(0xfff000);
        this.drawRect(this.world_mouse_coords.x-object_x-2, this.world_mouse_coords.y-object_y-2, 4, 4);
        this.endFill();
    }
}

export default VectorAim;
