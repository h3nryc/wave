var port = 3000
var express = require('express');
var fs = require('fs');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('dashboard'));
var router = express.Router();
//DB SET UP

var Datastore = require('nedb')
, tracks = new Datastore({ filename: './tracks.json', autoload: true });

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

app.get('/api/addTrack/:uid',addTrack);
