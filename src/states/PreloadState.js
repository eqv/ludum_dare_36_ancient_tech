class PreloadState extends Phaser.State {

  preload() {
    this.game.load.image('track1', 'pa_track1.png');
    this.game.load.image('arrows', 'arrows.png');
  }

	create() {
    console.log("preload created");
		this.state.start('RaceState');
	}

}

export default PreloadState;
