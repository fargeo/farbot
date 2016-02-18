#!/usr/bin/env node

'use strict';

/**
 * FarBot launcher script.
 *
 * @author Jeffrey Munowitch <jmunowitch@fargeo.com>
 */

var FarBot = require('../lib/farbot');
var later = require('later');

/**
* Environment variables used to configure the bot:
*
*  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
*      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
*  BOT_DB_PATH: the path of the SQLite database used by the bot
*  BOT_NAME: the username you want to give to the bot within your organisation.
*/
var token = process.env.BOT_API_KEY || require('../token');
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var farbot = new FarBot({
   token: token,
   dbPath: dbPath,
   name: name
});

farbot.run();

//required for Heroku
var http = require('http');
http.createServer(function (req, res) {
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.send('it is running\n');
}).listen(process.env.PORT || 5000);

later.date.localTime();

var sched = later.parse.text('at 10:30 am on Tues and Thurs'),
     t = later.setInterval(function() { farbot.postMessageToChannel('arches',"<!channel> Arches StandUp! Join Now: https://plus.google.com/hangouts/_/fargeo.com/arches-standup"); }, sched);

var sched = later.parse.text('at 10:30 am on Monday'),
    t = later.setInterval(function() { farbot.postMessageToChannel('mondaymeetings', '<!channel> Monday Meeting may or may not start soon: https://plus.google.com/hangouts/_/fargeo.com/monday-meeting'); }, sched);


// farbot._standupAlert('arches');
