class VectorAim extends Phaser.Graphics {
	constructor(game, x, y) {
		super(game, x, y);

        this._points = [];
        var p0 = new Phaser.Point(0, 0);
        this._points.push(p0);

        //this.fixedToCamera = true;
        this.render();

		this.game.stage.addChild(this);
	}

    render() {
        var object_x = this.x;
        var object_y = this.y;

        this.lineStyle(1, 0xffff00);
        this.moveTo(object_x, object_y);
        this.lineTo(object_x+100, object_y+100);

        this.beginFill(0xffff00);
        this.drawRect(object_x-2, object_y-2, 4, 4);
        this.endFill();

        this.beginFill(0xfff000);
        this.drawRect(object_x+100-2, object_y+100-2, 4, 4);
        this.endFill();
    }
}

export default VectorAim;
