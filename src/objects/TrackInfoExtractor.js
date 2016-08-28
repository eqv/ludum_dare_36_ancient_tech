class PointInfo {
  constructor(x,y){
    this.on_track = false;
    this.on_finish = false;
    this.checkpoint = undefined;
    this.x = x;
    this.y = y;
    this.score = Infinity;
  }

  key(){
    ""+this.x+","+this.y
  }
}

class TrackInfoExtractor {

	constructor(game, track) {

    this.game = game;
    this.num_points = track.num_points;
    this.get_map_data(track.name);
    this.get_matrix();
    this.gather_viable_points();
    this.gather_checkpoints();
    this.gather_point_scores();
    this.gather_finish_points();
    this.add_debug_map();
  }

  point_key(x,y){return ""+x+","+y;}

  get_map_data(name){
    let map_image = this.game.cache.getImage(name);

    this._track_size = {x: map_image.width, y: map_image.height};
    this._map_data = this.game.make.bitmapData(this._track_size.x, this._track_size.y);
    this._map_data.draw(name, 0, 0);
    this._map_data.update();
  }

  get_matrix(){
    let point_horizontal_dist = this._track_size.x/this.num_points;
    let point_vertical_dist = point_horizontal_dist *0.5 * (0.83);
    let base_1 = {x: point_horizontal_dist/2, y: point_vertical_dist/2};
    let base_2 = {x: -point_horizontal_dist/2, y: point_vertical_dist/2};
    this.matrix_track_to_world=  new Phaser.Matrix( base_1.x, base_1.y, base_2.x, base_2.y, 0, 0 );
  }

  get_info(x,y){
    let pt = this.snap_to_track(new Phaser.Point(x,y));
    return this.points.get( this.point_key(pt.x, pt.y) );
  }

  set_info(x,y, info){
    let pt = this.snap_to_track(new Phaser.Point(x,y));
    return this.points.set( this.point_key(pt.x, pt.y), info);
  }

  gather_viable_points(){
    this.points = new Map([]);
    for (let x = 0; x <= this._track_size.x; x++) {
      for (let y = 0; y <= this._track_size.y; y++) {
        let px = this.get_map(x,y);
        let pt = this.snap_to_track(new Phaser.Point(x,y))
        if(!this.is_on_track(this.get_map(pt.x, pt.y))){continue;}
        let info = this.get_info(pt.x, pt.y);
        if(!info){info = new PointInfo(pt.x, pt.y) };
        if(this.is_on_track(px)){info.on_track = true;}
        if(this.is_on_finish_line(px)){info.on_finish = true;}
        let checkpoint = this.is_on_check_point(px);
        if(checkpoint){info.checkpoint = checkpoint;}
        this.set_info(pt.x, pt.y, info);
        }
      }
  }

  gather_checkpoints(){
    this.checkpoint_numbers =new Set([]);
    for (let [key, info] of this.points.entries()) {
      if(info.checkpoint){
        this.checkpoint_numbers.add(info.checkpoint);
      }
    }
  }

  gather_point_scores(){
    let final_checkpoint = Math.max(...this.checkpoint_numbers);
    let closed_points = new Set([]);
    let open_points = new Set([...this.points.values()].filter(i =>i.checkpoint == final_checkpoint));
    let offsets = [[-1,-1], [-1,0], [-1,1],   [0,-1],[0,1],  [1,-1], [1,0], [1,1]];

    for(let info of open_points){info.score = 5;}

    while(open_points.size > 0){
      let this_info = open_points.values().next().value;
      open_points.delete(this_info);
      closed_points.add(this_info);
      if(this_info.on_finish) continue;
      for(let [x,y] of offsets){
        let track_pos = this.world_to_track(new Phaser.Point(this_info.x, this_info.y));
        track_pos.x += x;
        track_pos.y += y;
        let world_pos = this.track_to_world(track_pos)
        let neighbor_info = this.get_info(world_pos.x, world_pos.y);
        if( !neighbor_info ){continue;}
        if( !closed_points.has(neighbor_info) ){
           open_points.add(neighbor_info);
        }
        let dist = Math.sqrt(x*x+y*y)+this_info.score;
        if(neighbor_info.score > dist){
          neighbor_info.score = dist;
        }
      }
    }
  }

  gather_finish_points() {
    this.finish_points = []
    for (let [key, info] of this.points.entries()) {
      if(info.on_finish) {
        this.finish_points.push(info);
      }
    }
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

  get_map(x,y){
    return this._map_data.getPixelRGB(x,y);
  }

  is_on_track(px){
    return px.a > 200;
  }
  
  is_on_finish_line(px){
    return px.r == 0xff && px.g == 0xf0 && px.b == 0;
  }

  is_on_check_point(px){
    if(px.r == 0xa0){
      return px.g;
    } else {
      return false
    }
  }

  debug_render(){
    let circ = new Phaser.Circle(0,0,5);

    for(let point of this.points.values()){
      let info = this.get_info(point.x, point.y);
      circ.x = point.x;
      circ.y = point.y;
      circ.radius = 1; 
      if(info) circ.radius = info.score/50
      this.game.debug.geom(circ);
    }

    let pointer = this.game.input.mousePointer; //activePointer;
    let track_pointer = this.snap_to_track(new Phaser.Point(pointer.worldX, pointer.worldY));
    let info = this.get_info(track_pointer.x, track_pointer.y);
    circ.x = track_pointer.x;
    circ.y = track_pointer.y;
    circ.radius = 1;
  }

  add_debug_map(){
    this._map_data.addToWorld();
  }

}

export default TrackInfoExtractor;
