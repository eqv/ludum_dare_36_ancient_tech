class VectorAim extends Phaser.Graphics {
	constructor(game, x, y) {
		super(game, x, y);

        this._points = [];
        var p0 = new Phaser.Point(0, 0);
        this._points.push(p0);

		this.game.stage.addChild(this);
	}

    render() {
        this.strokeStyle = 'rgb(0,255,255)';
        this.beginPath();
        this.moveTo(0, 0);
        this.lineTo(100, 100);
        this.stroke();
        this.closePath();

        this.fillStyle = 'rgb(255,255,0)';
        this.fillRect(0, 0, 4, 4);

        this.fillStyle = 'rgb(255,0,0)';
        this.fillRect(100, 100, 4, 4);
    }
}

export default VectorAim;
