var port = 3000
var express = require('express');
var fs = require('fs');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('dashboard'));
var router = express.Router();
//DB SET UP
var ticks = [];
var Datastore = require('nedb')
, tracks = new Datastore({ filename: './tracks.json', autoload: true }), info = new Datastore({ filename: './info.json', autoload: true });
var dataqueue = [];
var addTrack = function(req,res,next) {
  var doc = { unix: Date.now()
               , id: req.params.uid
               };

  tracks.insert(doc, function (err, newDoc) {
    if (err) {console.log(err);} else {
        res.end('Added Track')
    }
  });
}
function tickmanager() {
  function timeout() {
    setTimeout(function () {
      console.log("tick run");
      console.log(ticks);
      for (i = 0; i < ticks.length; i++) {
        console.log("ok");
        if (ticks[i] == "rtr_unixtime") {
          console.log({"type":"cmdrtr","value":"SystemTime: "+Date.now()});
          dataqueue.push({"type":"cmdrtr","value":"SystemTime: "+Date.now()});
        }
      }
      timeout();
    }, 200);
  }
  timeout();
}
function addtick(com) {
  ticks.push(com);
}
var discover = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send({
	"name": "Test Wave",
	"ip": "192.168.1.4",
	"device": "WaveDevice"
});
}
var poll = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.send(dataqueue);
    dataqueue = [];
}
var cmd = function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(req.query.c);
    var jcmd = JSON.parse(req.query.c);
    if (jcmd.cmd.type == "tick") {
      console.log("cmd check tick");
      addtick(jcmd.cmd.command);
    }
    res.send("done");
}
app.get('/api/addTrack/:uid',addTrack);
app.get('/api/discover/', discover);
app.get('/api/poll/', poll);
app.get('/api/cmd/', cmd);
tickmanager();
