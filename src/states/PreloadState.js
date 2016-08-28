class PreloadState extends Phaser.State {

  preload() {
    this.game.load.image('track1', 'pa_track1.png');
    this.game.load.image('arrows', 'arrows.png');
    this.game.load.spritesheet('button', 'buttons.png', 180, 70);
  }

	create() {
		this.state.start('MenuState');
	}

}

export default PreloadState;
