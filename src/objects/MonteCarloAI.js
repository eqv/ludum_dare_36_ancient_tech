class DecisionPath {

  constructor(path, dist, checkpoints_covered){
    this.path = path
    this.dist = dist
    this.checkpoints_covered=checkpoints_covered
  }

  better_than(other){
    return ((this.dist < other.dist && this.checkpoints_covered == other.checkpoints_covered) || this.checkpoints_covered > other.checkpoints_covered)
  }

  accel(){
    return this.path[0]
  }

}

class MonteCarloAI extends Phaser.Graphics{

  constructor(game, racer, trackinfo){
    super(game, 0, 0);
    this.racer = racer
    this.trackinfo = trackinfo
    this.game.world.add(this);
    this.restart_thinking();
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

  mutate_accel(accel, max_accel){
    for(let i = 0; i < 100; i++){
      let x = Math.random()-0.5;
      let y = Math.random()-0.5;
      if(Math.sqrt(x*x+y*y) <= 1){
        x*=0.3*max_accel
        y*=0.3*max_accel
        if(!accel){debugger}
        return new Phaser.Point(accel.x+x,accel.y+y);
      }
    }
  }

  mutate_path(path, max_accel){
    let index = Math.floor(Math.random() * (path.length))%path.length;
    path[index] = this.mutate_accel(path[index], max_accel)
  }

  sample_run(phys,len) {
    let path = []
    for(let i = 0; i < len ; i++){
      let next_accel = this.sample_accel(phys)
      path.push(next_accel)
      phys.acceleration = next_accel
      phys.move()
    }
    return [path,phys]
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

  next_checkpoint_dist(id){
    let next_checkpoint = (this.trackinfo.checkpoints.findIndex(x => x.id == id)+1) % this.trackinfo.checkpoints.length
    return this.trackinfo.checkpoints[next_checkpoint].dist;
  }

  score_path(old_phys, path, new_phys){
    let old_checkpoint = old_phys.last_checkpoint_id;
    let last_info = this.trackinfo.get_info(new_phys.x, new_phys.y)
    let last_dist = Infinity
    if(last_info) last_dist = last_info.dist;
    let path_dist = Math.abs(last_dist - this.next_checkpoint_dist(new_phys.last_checkpoint_id) )
    let checkpoints_covered = this.checkpoints_between(old_checkpoint, new_phys.last_checkpoint_id)
    return new DecisionPath(path, path_dist, checkpoints_covered)
  }

  evaluate_and_score_path(phys, path){
    let old_phys = phys.fork()
    for(let a of path){
      phys.acceleration = a
      phys.move()
    }
    return this.score_path(old_phys, path, phys)
  }

  get_path_positions(phys, path){
    let positions = [[phys.x, phys.y]]
    for(let a of path){
      phys.acceleration = a
      phys.move()
      positions.push([phys.x, phys.y])
    }
    return positions
  }

  restart_thinking(){
    if(this.best_path){
      let new_path = this.best_path.path
      new_path.shift
      new_path.push(new Phaser.Point(0,0))
      this.best_path = this.evaluate_and_score_path(this.racer.physics.fork(), new_path)
      for(let i=0; i<20; i++){
        this.mutate_best_path()
      }
    } else {
      this.best_path = new DecisionPath([], Infinity, 0)
    }
    this.rounds_thought = 0
  }

  build_random_path(len_path){
      let curr_physics = this.racer.physics.fork();
      let [path,new_physics] = this.sample_run(curr_physics, len_path)
      let scored_path  = this.score_path(this.racer.physics, path, new_physics)
      if( scored_path.better_than(this.best_path) ){
        this.best_path = scored_path
      }
  }

  mutate_best_path(){
    let path = [...this.best_path.path]
    this.mutate_path(path, this.racer.physics.max_acceleration)
    let scored_path = this.evaluate_and_score_path(this.racer.physics.fork(), path)
    if( scored_path.better_than(this.best_path) ){
      this.best_path = scored_path
    }
  }


  think(num_paths, len_paths){
    for(let i = 0; i < num_paths; i++){
      this.build_random_path(len_paths)
      this.mutate_best_path()
      this.mutate_best_path()
    }
  }

  debug_render(){
    if(!this.best_path) return
    let circ = new Phaser.Circle(0,0,5);
    for( let [x,y] of this.get_path_positions(this.racer.physics.fork(), this.best_path.path)){
      circ.x = x
      circ.y = y
      circ.radius = 10
      this.game.debug.geom(circ);
    }
  }

  update(){
    if (!this.alive) return;
    if (this.rounds_thought > 100){
      this.racer.physics.acceleration = this.best_path.accel()
      this.racer.move()
      this.game.state.states.RaceState.next_player();
      console.log("ai's turn", this.best_move);
      this.restart_thinking()
      return
    }
    this.think(70,5)
    this.rounds_thought += 1;
  }
}

export default MonteCarloAI;
