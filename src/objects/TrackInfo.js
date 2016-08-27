class TrackInfo {

	constructor(game, track) {
    this.game = game;
    this._track = track;
    this._track_size = {x: 1000, y: 749}
    this._track_data = game.make.bitmapData(this._track_size.x, this._track_size.y);
    this._track_data.draw(track, 0, 0);
    this._track_data.update();
    this._track_data.addToWorld();
    let track_points = 20;
    let point_horizontal_dist = this._track_size.x/track_points;
    let point_vertical_dist = point_horizontal_dist *0.5 * (0.83);
    let base_1 = {x: point_horizontal_dist/2, y: point_vertical_dist/2};
    let base_2 = {x: -point_horizontal_dist/2, y: point_vertical_dist/2};
    this.matrix_track_to_world = new Phaser.Matrix( base_1.x, base_1.y, base_2.x, base_2.y, 0, 0 );
    this.game.add.sprite(game.world.randomX, game.world.randomY, 'arrows');
    this.track_points = this.gather_viable_points();
    console.log(this.track_points.size);
	}

  snap_to_track(world_point){ 
    return this.track_to_world( this.world_to_track( world_point ) );
  }

  track_to_world(point){
    let pt = this.matrix_track_to_world.apply(point);
    pt.x += this._track_size.x/2;
    pt.x = Math.round(pt.x);
    pt.y = Math.round(pt.y);
    return pt;
  }

  world_to_track(point){
    let pt = this.matrix_track_to_world.applyInverse(new Phaser.Point(point.x - this._track_size.x/2, point.y));
    pt.x = Math.round(pt.x);
    pt.y = Math.round(pt.y);
    return pt;
  }

  gather_viable_points(){
    let points = new Set([]);
    for (let x =0; x <= this._track_size.x; x++) {
      for (let y =0; y <= this._track_size.y; y++) {
        let pt = this.snap_to_track(new Phaser.Point(x,y))
        if(pt.x == x && pt.y == y){
          let px = this._track_data.getPixelRGB(x,y);
          if(px.a > 200){
              points.add({x: x, y: y});
          }
        }
      }
    }
    return new Set(points);
  }

  debug_render(){
    let circ = new Phaser.Circle(0,0,5);
    for(let point of this.track_points){
      circ.x = point.x;
      circ.y = point.y;
      this.game.debug.geom(circ);
    }
  }

}

export default TrackInfo;
