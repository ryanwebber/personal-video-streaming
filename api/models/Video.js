/**
 * Video.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {

	attributes: {
		file: {
            type: 'string'
        },
        uploaded: {
		type: 'boolean',
		defaultsTo: false
        }
	},
	beforeUpdate: function(values, cb){
		if(!!values.file && values.uploaded === undefined){
			values.uploaded = true;
		}
		cb();
	}
 };

