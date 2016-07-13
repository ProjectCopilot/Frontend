// Project Copilot Concierge

var express = require('express');
var app = express();
var dotenv = require('dotenv').config({path: __dirname+'/.env'});

app.use('/', express.static(__dirname+'/static'));


app.listen(process.env.PORT, process.env.HOSTNAME, function () {
  console.log('Copilot Concierge service successfully running at '
      + process.env.HOSTNAME + ':' + process.env.PORT);
});

