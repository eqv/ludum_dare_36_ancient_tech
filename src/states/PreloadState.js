class PreloadState extends Phaser.State {

  preload() {
    this.game.load.image('track1', 'pa_track1.png');
  }

	create() {
    console.log("preload created");
		this.state.start('MainMenuState');
	}

}

export default PreloadState;
