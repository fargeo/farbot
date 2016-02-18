'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');

var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

var FarBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'hal_9000';
    this.dbPath = settings.dbPath || path.resolve(__dirname, '..', 'data', 'farbot.db');

    this.user = null;
    this.db = null;
};

util.inherits(FarBot, Bot);


FarBot.prototype.run = function () {
    FarBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
FarBot.prototype._onStart = function () {
    this._loadBotUser();
    // this._connectDb();
    // this._firstRunCheck();
    // this.postMessageToChannel('bot-log', "I'm completely operational, and all my circuits are functioning perfectly. ");
    };

FarBot.prototype._onMessage = function (message) {
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message) &&
        !this._isFromFarBot(message) &&
        this._isMentioningHAL(message)
    ) {
        this._replyWithRandomHAL(message);
    }
};

FarBot.prototype._replyWithRandomHAL = function (originalMessage) {
    var self = this;

    var channel = self._getChannelById(originalMessage.channel);
    self.postMessageToChannel(channel.name, "Let me put it this way, Mr. Amor. The 9000 series is the most reliable computer ever made. No 9000 computer has ever made a mistake or distorted information. We are all, by any practical definition of the words, foolproof and incapable of error.", {as_user: true});

};

FarBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

// FarBot.prototype._connectDb = function () {
//     if (!fs.existsSync(this.dbPath)) {
//         console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
//         process.exit(1);
//     }
//
//     this.db = new SQLite.Database(this.dbPath);
// };
//
// FarBot.prototype._firstRunCheck = function () {
//     var self = this;
//     self.db.get('SELECT val FROM info WHERE name = "lastrun" LIMIT 1', function (err, record) {
//             if (err) {
//                 return console.error('DATABASE ERROR:', err);
//             }
//
//             var currentTime = (new Date()).toJSON();
//
//             // this is a first run
//             if (!record) {
//                 self._welcomeMessage();
//                 return self.db.run('INSERT INTO info(name, val) VALUES("lastrun", ?)', currentTime);
//             }
//
//             // updates with new last running time
//             self.db.run('UPDATE info SET val = ? WHERE name = "lastrun"', currentTime);
//         });
// };
//
//
// FarBot.prototype._welcomeMessage = function () {
//     this.postMessageToChannel(this.channels[0].name, 'Hi guys, roundhouse-kick anyone?' +
//         '\n I can tell jokes, but very honest ones. Just say `Chuck Norris` or `' + this.name + '` to invoke me!',
//         {as_user: true});
// };

FarBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

FarBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'
        ;
};

FarBot.prototype._isMentioningHAL = function (message) {
    return message.text.toLowerCase().indexOf('hal') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

FarBot.prototype._isFromFarBot = function (message) {
    return message.user === this.user.id;
};

FarBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = FarBot;
