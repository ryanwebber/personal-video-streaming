/**
 * Movie.js
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
		image: {
			type: 'string'
		},
		description: {
			type: 'string'
		},
		year: {
			type: 'integer',
			required: true
		},
		video: {
			model: 'video'
		}
	}
 };
