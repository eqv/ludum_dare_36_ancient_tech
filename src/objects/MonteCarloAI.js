class MonteCarloAI {

  constructor(racer, trackinfo, name){
    this.racer = racer
    this.trackinfo = trackinfo
    this.name = name;
  }

  sample_accel(phys){
    for(let i = 0; i < 100; i++){
      let x = Math.random()-0.5;
      let y = Math.random()-0.5;
      if(Math.sqrt(x*x+y*y) <= 1){
        x*=2*phys.max_acceleration;
        y*=2*phys.max_acceleration;
        if( this.trackinfo.is_on_track(this.trackinfo.get_map(phys.x+phys.velocity.x+x, phys.y+phys.velocity.y+y)) ) {
          return new Phaser.Point(x,y);
        }
      }
    }
    return new Phaser.Point(0,0);
  }

  next_checkpoint_dist(phys){
    let next_checkpoint = this.trackinfo.checkpoints.indexOf(phys.last_checkpoint)+1 % this.trackinfo.checkpoints.length
    return this.trackinfo.checkpoints[next_checkpoint].dist;
  }

  sample_run(phys,len) {
    this.last_path = [[phys.x, phys.y]]
    for(let i = 0; i < len ; i++){
      phys.acceleration = this.sample_accel(phys)
      phys.move()
      this.last_path.push([phys.x, phys.y])
    }
    let last_info = this.trackinfo.get_info(phys.x, phys.y)
    if(!last_info){
      return Infinity
      debugger;
    }
    let last_dist = last_info.dist;
    return Math.abs(last_dist - this.next_checkpoint_dist(phys) );
  }

  decide(num_paths, len_paths){
    let best_score = Infinity
    let best_move = new Phaser.Point(0,0);
    let best_path = null
    for(let i = 0; i < num_paths; i++){
      let curr_physics = this.racer.physics.fork();
      let curr_accel = this.sample_accel(curr_physics, this.trackinfo)
      if(!curr_accel){continue}
      curr_physics.acceleration = curr_accel;
      curr_physics.move();
      let score = this.sample_run(curr_physics, len_paths);
      console.log(score, this.last_path)
      if(score < best_score){
        best_score = score;
        best_move = curr_accel;
        best_path = this.last_path;
      }
    }
    this.last_path = best_path;
    console.log(best_score, this.last_path);
    return best_move;
  }

  debug_render(){
    let circ = new Phaser.Circle(0,0,5);
    for( let [x,y] of this.last_path){
      circ.x = x
      circ.y = y
      circ.radius = 10
      this.racer.game.debug.geom(circ);
    }
  }
}

export default MonteCarloAI;
