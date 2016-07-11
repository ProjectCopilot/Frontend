// Project Copilot Concierge

var express = require('express');
var app = express();
var dotenv = require('dotenv');
dotenv.load();

app.use('/', express.static(__dirname+'/static'));


app.listen(process.env.PORT, function () {
  console.log('Copilot Concierge service successfully running at localhost:'+process.env.PORT);
});
