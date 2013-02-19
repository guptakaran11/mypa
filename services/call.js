var _ = require('underscore');
var comb = require('comb');
var schedule = require('node-schedule');
var RecurrenceRule = schedule.RecurrenceRule;
var notesImpl = require('./notes');
var logger = require('../utils/log_factory').create("call");

var Twilio = require('twilio-js');
Twilio.AccountSid = CONFIG.twilio.account_sid;;
Twilio.AuthToken  = CONFIG.twilio.auth_token;

var Call = comb.define({
	instance : {
		constructor : function(options){
			options = options || {};
			this._super(arguments);
		},
		
		send : function(to, noteSubject, userId, text){
			_.each(to, function(num){
				Twilio.Call.create({to: num, from: CONFIG.twilio.number, 
                                    url: CONFIG.twilio.callback.call + "?user=" + userId + "&subject=" + encodeURIComponent(noteSubject)}, 
                                    function(err,res) {
					if(err){
						logger.error(err);
					}else
						logger.info('HOLY MOLY! PHONES ARE RINGING');
				});
			});
		}
	}
});

module.exports = new Call();
