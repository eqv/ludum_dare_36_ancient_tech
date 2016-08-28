class MonteCarloAI extends Phaser.Graphics{

  constructor(game, racer, trackinfo){
    super(game, 0, 0);
    this.racer = racer;
    this.trackinfo = trackinfo;
    this.name = name;
    this.game.world.add(this);
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


  checkpoints_between(ida, idb){
    if(ida == idb) return 0
    if(ida == null) return idb
    let first_index = this.trackinfo.checkpoints.findIndex(x => x.id == ida);
    for( let i = 0; i<this.trackinfo.checkpoints.length; i++){
      if(this.trackinfo.checkpoints[(i+first_index) % this.trackinfo.checkpoints.length].id == idb){
        return i
      }
    }
    return 0;
  }

  next_checkpoint_dist(phys){
    let next_checkpoint = (this.trackinfo.checkpoints.findIndex(x => x.id == phys.last_checkpoint_id)+1) % this.trackinfo.checkpoints.length
    if(!this.trackinfo.checkpoints[next_checkpoint]){
      debugger;
    }
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
      return [Infinity,0]
      debugger;
    }
    let last_dist = last_info.dist;
    return [Math.abs(last_dist - this.next_checkpoint_dist(phys) ), phys.last_checkpoint_id];
  }

  decide(num_paths, len_paths){
    let best_dist = Infinity
    let best_move = new Phaser.Point(0,0);
    let best_path = null
    let best_checkpoints_covered = 0
    for(let i = 0; i < num_paths; i++){
      let curr_physics = this.racer.physics.fork();
      let old_checkpoint = curr_physics.last_checkpoint_id;
      let curr_accel = this.sample_accel(curr_physics, this.trackinfo)
      if(!curr_accel){continue}
      curr_physics.acceleration = curr_accel;
      curr_physics.move();
      let [dist_to_new,new_checkpoint] = this.sample_run(curr_physics, len_paths);
      let checkpoints_covered = this.checkpoints_between(old_checkpoint, new_checkpoint)
      if((dist_to_new < best_dist && checkpoints_covered == best_checkpoints_covered) || checkpoints_covered > best_checkpoints_covered){
        best_dist = dist_to_new;
        best_checkpoints_covered = checkpoints_covered;
        best_move = curr_accel;
        best_path = this.last_path;
      }
    }
    this.last_path = best_path;
    return best_move;
  }

  debug_render(){
    let circ = new Phaser.Circle(0,0,5);
    for( let [x,y] of this.last_path){
      circ.x = x
      circ.y = y
      circ.radius = 10
      this.game.debug.geom(circ);
    }
  }

  update(){
    if (!this.alive) return;
    let accel = this.decide(3000,5)
    console.log("ai's turn", accel);
    this.racer.physics.acceleration = accel
    this.racer.move()
    this.game.state.states.RaceState.next_player();
  }
}

export default MonteCarloAI;
