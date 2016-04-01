/**
 * Episode.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {
	autoPK: false,
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		trakt_id: {
			type: 'integer',
			required: true,
			primaryKey: true
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
		video: {
			model: 'video'
		}
	}
 };
