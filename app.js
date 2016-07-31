// Project Copilot Concierge

const express = require('express');
const app = express();
const colors = require('colors');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });
const fs = require('fs');

// Substitute special environment variables
app.get('/js/main.js', function (req, res) {
  res.header('Content-Type', 'application/javascript');

  fs.readFile(__dirname + '/static/js/main.js', 'utf-8', function (e, data) {
    if (e) throw e;

    const load = data.replace(/{HOSTNAME}/g, process.env.MAILROOM_HOSTNAME).replace(/{PORT}/g, process.env.MAILROOM_PORT);
    res.send(load);
  });
});

app.use('/', express.static(__dirname + '/static'));


app.listen(process.env.PORT, process.env.HOSTNAME, function () {
  console.log(('Copilot Concierge running at ').blue + (process.env.HOSTNAME+":"+process.env.PORT).magenta);
});
