/**
 * Episode.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var fmt = require('show-episode-format');

var fmt2 = function(num){
	if(num >= 10) return "e" + num;
	else return "e0" + num;
}

module.exports = {
 	attributes: {
 		name: {
 			type: 'string',
 			required: true
 		},
 		trakt_id: {
 			type: 'integer',
 		},
 		screenshot: {
 			type: 'string'
 		},
 		description: {
 			type: 'string'
 		},
 		episodeNumber: {
 			type: 'integer',
 			required: true
 		},
 		episodeNumberAlt: {
 			type: 'integer'
 		},
 		seasonNumber: {
 			type: 'integer',
 			required: true
 		},
 		season: {
 			model: 'season'
 		},
 		show: {
 			model: 'show'
 		},
 		video: {
 			model: 'video'
 		},
 		sXeX: function(){
 			var x = fmt2(this.episodeNumber);

 			if(this.episodeNumberAlt){
 				x = x + " & " + fmt2(this.episodeNumberAlt);
 			}
 			return x;
 		},
 		toJSON: function() {
			var obj = this.toObject();
			obj.sXeX = this.sXeX();
			return obj;
	    }
 	},
 	beforeValidate: function(values, cb){
 		var n = values.episodeNumberAlt;
 		if(isNaN(parseFloat(n)) || !isFinite(n)){
 			delete values.episodeNumberAlt;
 		}
 		cb();
 	}
 };

