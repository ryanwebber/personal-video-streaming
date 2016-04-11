/**
 * Episode.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var fmt = require('show-episode-format');

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
 			return fmt.formatEpisodeRelease({
 				season: this.seasonNumber,
 				episode: this.episodeNumber
 			});
 		},
 		toJSON: function() {
			var obj = this.toObject();
			obj.sXeX = this.sXeX();
			return obj;
	    }
 	}
 };

