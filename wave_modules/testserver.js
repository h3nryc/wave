var port = 3000
var express = require('express');
var fs = require('fs');
var app = express();
var server = app.listen(process.env.PORT || 3000);
app.use(express.static('dashboard'));
var router = express.Router();
app.get('/api/discover/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send({name:"Tom's Wave", ip:"192.168.1.4"});
})
app.listen(3005)
