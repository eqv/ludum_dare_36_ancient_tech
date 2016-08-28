class ResultState extends Phaser.State {
    init(winner) {
        this.winner = winner;
    }

    create() {
        let text = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.winner + " wins");

        text.anchor.set(0.5);
        text.align = 'center';

        text.font = 'Arial';
        text.fontWeight = 'bold';
        text.fontSize = 35;

        text.stroke = '#ffffff';
        text.strokeThickness = 6;
        text.fill = '#43d637';
    }
}

export default ResultState;
