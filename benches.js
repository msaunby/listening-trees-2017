var benches = {state:{}, remote:{}, nodes:[], links:[], addNode:null};

benches.addNode = function(){
  benches.nodes.push({name:"No name"});
}

benches.addLink = function(){
  var len = benches.nodes.length;
  if(len > 1){
    var link = {source:len-1, dest:len-2};
    benches.links.push( link );
  }
}

benches.getMsg = function(){
  return JSON.stringify({nodes:benches.nodes,links:benches.links});
}

benches.setState = function(key, value, set_remotely){
  console.log("setState", key)
  benches.state[key] = value;
  benches.remote[key] = set_remotely;
  benches.nodes = [];
  for( var p in benches.state){
    console.log(p, benches.state[p]);
    benches.nodes.push({name:p,state:benches.state[p],remote:benches.remote[p]});
  }
}

module.exports = benches;
