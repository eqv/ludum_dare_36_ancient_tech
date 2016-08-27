class PreloadState extends Phaser.State {

  preload() {
    console.log("preload");
  }

	create() {
    console.log("preload created");
		this.state.start('MainMenuState');
	}

}

export default PreloadState;
