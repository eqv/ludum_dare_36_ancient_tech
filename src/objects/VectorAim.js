class VectorAim extends Phaser.Graphics {
	constructor(game, x, y) {
		super(game, x, y);

        //this._points = [];
        this.p0 = new Phaser.Point(0, 0);
        //this._points.push(p0);

        this.fixedToCamera = false;
        this.render();

		this.game.world.add(this);
	}

    update() {
        var pointer = this.game.input.mousePointer; //activePointer;
        this.p0.x = pointer.worldX;
        this.p0.y = pointer.worldY;
        this.render()
    }

    render() {
        this.clear();

        var object_x = this.x;
        var object_y = this.y;

        this.lineStyle(1, 0xffff00);

        this.beginFill(0xff0000);
        this.drawCircle(0, 0, 100);
        this.endFill();

        this.lineStyle(1, 0xffff00);
        this.moveTo(0,0);
        this.lineTo(this.p0.x-object_x, this.p0.y-object_y);

        this.beginFill(0xffff00);
        this.drawRect(0-2, 0-2, 4, 4);
        this.endFill();

        this.beginFill(0xfff000);
        this.drawRect(this.p0.x-object_x-2, this.p0.y-object_y-2, 4, 4);
        this.endFill();
    }
}

export default VectorAim;
