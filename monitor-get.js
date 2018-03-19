

var mypeer = {p:[], refresh:null};

mypeer.refresh = function(req, res, benches){

  console.log("MONITOR REQ", req);
  mypeer.sendAll( msg );

  //mypeer.p.push( p );
};

mypeer.sendAll = function( msg ){
    /* send message to all non null peers
     * build a list of these to prune the nulls
    */
    console.log("sendAll", msg);
    var new_list = [];
    /*
    for(var i = 0; i < mypeer.p.length; i++){
      if(mypeer.p[i]){
        try{
          mypeer.p[i].send(msg);
          new_list.push(mypeer.p[i]);
        }catch(e){
          console.log("SENDALL", e);
        }
      }
    }
    */
    mypeer.p = new_list;
};

module.exports = mypeer;
