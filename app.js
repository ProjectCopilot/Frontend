/*
  * Copilot Concierge
  * (c) Copyright 2016-2017 Project Copilot
*/

const express = require('express');
const app = express();
const fs = require('fs');
const keen = require('keen-tracking');

require('colors');
require('dotenv').config({ path: `${__dirname}/.env` });

// Initialize analytics tracking
let analytics = new keen({
    projectId: process.env.KEEN_PROJECTID,
    writeKey: process.env.KEEN_WRITEKEY
});

// Substitute special environment variables
app.get('/js/main.js', function (req, res) {
  res.header('Content-Type', 'application/javascript');
  fs.readFile(__dirname + '/static/js/main.js', 'utf-8', function (e, data) {
    if (e) throw e;
    const load = data.replace(/{HOST}/g, process.env.MAILROOM_URL);
    res.send(load);
  });
});

app.use('/', (req, res, next) => {
    if (req.originalUrl == '/')
	analytics.addEvent('concierge_pageviews', {});
    next();
});
app.use('/', express.static(`${__dirname}/static`));

app.listen(process.env.PORT, process.env.HOSTNAME, function () {
  console.log(('Copilot Concierge running at ').blue + (process.env.HOSTNAME+":"+process.env.PORT).magenta);
});
