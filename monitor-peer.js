var Peer = require('simple-peer')
var wrtc = require('wrtc')

var mypeer = {p:[], refresh:null};

mypeer.refresh = function(req, res, benches){

var p = new Peer({ initiator: false, wrtc: wrtc})
var signal_data = [];
var do_send = false;
var msg = req.query['msg'];
p.signal( msg );


p.on('error', function (err) { console.log('error', err) })

p.on('data', function (data) {
  var o;
  try{
    o = JSON.parse(data);
    console.log('data', o);
  }catch(e){
     console.log(e);
     o={};
  }

  var msg={};
  if(o.offer){
    msg = JSON.stringify(o);
  }
  else if(o.answer){
    msg = JSON.stringify(o);
  }
  else{
    msg = benches.getMsg();
  }
  console.log('sending', msg );
  mypeer.sendAll( msg );
});

p.on('signal', function (data) {
  //document.querySelector('#outgoing').textContent = JSON.stringify(data)
  console.log('SIGNAL', JSON.stringify(data))
  if(data.candidate){
    if(do_send){
      signal_data.push(data);
      res.json ( signal_data );
      do_send = false;
    }
  }
  if(res){
    if(data.type === "answer"){
      signal_data = [data];
      do_send = true;
    }
  }
 });

 mypeer.p.push( p );
};

mypeer.sendAll = function( msg ){
    /* send message to all non null peers
     * build a list of these to prune the nulls
    */
    console.log("sendAll");
    var new_list = [];
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
    mypeer.p = new_list;
};

module.exports = mypeer;
