/**
 * Movie.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {
 	attributes: {
 		name: {
 			type: 'string',
 			required: true
 		},
 		trakt_id: {
 			type: 'integer',
 		},
 		poster: {
 			type: 'string'
 		},
 		cover: {
 			type: 'string'
 		},
 		description: {
 			type: 'string'
 		},
 		year: {
 			type: 'string',
 			required: true
 		},
 		video: {
 			model: 'video',
 		}
 	}
 };

