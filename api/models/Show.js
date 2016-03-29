/**
 * Show.js
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
		description: {
			type: 'string'
		},
		image: {
			type: 'string'
		},
		seasons: {
			collection: 'season',
			via: 'show'
		}
	}
 };
