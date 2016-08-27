class TrackInfo {

	constructor(game, track) {
    this.game = game;
    this._track = track;

    let bmd = game.make.bitmapData(800, 600);
    bmd.draw(track, -200, -100);
    bmd.update();
    bmd.addToWorld();
    this.game.add.sprite(game.world.randomX, game.world.randomY, 'arrows');

		//this.game.stage.addChild(this);
	}
}

export default TrackInfo;
