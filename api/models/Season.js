/**
 * Season.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {
	autoPK: false,
	attributes: {
		trakt_id: {
			type: 'integer',
			required: true,
			primaryKey: true
		},
		seasonNumber: {
			type: 'integer',
			required: true
		},
		episodes: {
			collection: 'episode',
			via: 'season'
		},
		show: {
			model: 'show'
		}
	}
 };
