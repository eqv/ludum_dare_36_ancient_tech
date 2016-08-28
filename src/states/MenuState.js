class MenuState extends Phaser.State {
    create() {
        let pvp_button = this.game.add.button(this.game.world.centerX - 95, 300, 'button', this.start_pvp, this, 2, 1, 0);
        let pve_button = this.game.add.button(this.game.world.centerX - 95, 400, 'button', this.start_pve, this, 5, 4, 3);
    }

    start_pvp() {
		  this.state.start('RaceState', true, false, true);
    }

    start_pve() {
		  this.state.start('RaceState', true, false, false);
    }
}

export default MenuState;
