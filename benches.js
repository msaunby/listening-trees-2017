var benches = {states:{}, nodes:[], links:[], addNode:null};

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

benches.setState = function(key, value){
  console.log("setState", key)
  benches.states[key] = value;
  benches.nodes = [];
  for( var p in benches.states){
    console.log(p, benches.states[p]);
    benches.nodes.push({name:p,state:benches.states[p]});
  }
}

module.exports = benches;
