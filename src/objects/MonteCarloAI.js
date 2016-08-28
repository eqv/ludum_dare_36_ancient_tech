class MonteCarloAI {

  constructor(racer, trackinfo){
    this.racer = racer
    this.trackinfo = trackinfo
  }

  sample_accel(racer){
    for(let i = 0; i < 100; i++){
      x = Math.random()-0.5;
      y = Math.random()-0.5;
      if(Math.sqrt(x*x+y*y) <= 1){
        x*=racer.max_acceleration;
        y*=racer.max_acceleration;
        if( this.trackinfo.on_track(this.trackinfo.get_map(racer.pos.x+racer.speed.x+x, racer.pos.y+racer.speed.y+y)) ) {
          return new Phaser.Point(x,y);
        }
      }
    }
  }

  next_checkpoint_dist(racer){
    return this.trackinfo.checkpoints[racer.next_checkpoint].min_dist;
  }

  sample_run(racer,len) {
    for(let i = 0; i < len ; i++){
      racer.acceleration = sample_accel(racer, this.trackinfo)
      racer.move()
    }
    let last_dist = this.trackinfo.get_info(racer.pos.x, racer.pos.y).score;
    return Math.abs(last_dist, this.next_checkpoint_dist(racer) );
  }

  decide(racer, num_paths, len_paths){
    best_score = -Infinity
    best_move = undefined
    for(let i = 0; i < len; i++){
      curr_physics = racer.physics.clone();
      curr_accel = sample_accel(curr_physics, trackinfo)
      curr_physics.acceleration = curr_accel;
      curr_physics.move();
      score = sample_run(curr_physics, 5, trackinfo);
    }
    return best_move;
  }

  debug_render(){
  }
}

export default MonteCarloAI;
