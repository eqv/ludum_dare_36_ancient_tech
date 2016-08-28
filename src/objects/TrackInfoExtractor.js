class PointInfo {
  constructor(x,y){
    this.on_track = false;
    this.on_finish = false;
    this.checkpoint = undefined;
    this.x = x;
    this.y = y;
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
    this.add_debug_map();
  }

  key(x,y){return ""+x+","+y;}

  get_map_data(name){
    let map_image = this.game.cache.getImage(name);

    this._track_size= {x: map_image.width, y: map_image.height};
    this._map_data= this.game.make.bitmapData(this._track_size.x, this._track_size.y);
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

  gather_viable_points(){
    this.points = new Map([]);
    for (let x =0; x <= this._track_size.x; x++) {
      for (let y =0; y <= this._track_size.y; y++) {
        let px = this.get_map(x,y);
        let pt = this.snap_to_track(new Phaser.Point(x,y))
        if(!this.is_on_track(this.get_map(pt.x, pt.y))){continue;}
        let info = this.points.get(""+pt.x+","+pt.y);
        if(!info){info = new PointInfo(pt.x, pt.y) };
        if(this.is_on_track(px)){info.on_track = true;}
        if(this.is_on_finish_line(px)){info.on_finish = true;}
        let checkpoint = this.is_on_check_point(px);
        if(checkpoint){info.checkpoint = checkpoint;}
        this.points.set(info.key(), info);
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
    let seen_points = [...this.points.values()].filter(i =>i.checkpoint);
    let scores = new Map([])
    for(let p of seen_points){scores[p.key] = 0;}
    while(p = seen_points.pop()){
      for(let [x,y] of [[-1,-1], [-1,0], [-1,1],   [0,-1],[0,1],  [1,-1], [1,0], [1,1]]){
        
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
      circ.x = point.x;
      circ.y = point.y;
      this.game.debug.geom(circ);
    }

    let pointer = this.game.input.mousePointer; //activePointer;
    let track_pointer = this.snap_to_track(new Phaser.Point(pointer.worldX, pointer.worldY));
    circ.x = track_pointer.x;
    circ.y = track_pointer.y;
    circ.radius = 10;
    this.game.debug.geom(circ);
  }

  add_debug_map(){
    this._map_data.addToWorld();
  }

}

export default TrackInfoExtractor;
