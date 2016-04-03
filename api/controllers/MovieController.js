/**
 * MovieController
 *
 * @description :: Server-side logic for managing movies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updates: function(req, res){
		if(req.isSocket){
			Movie.watch(req);
		}
		res.send(200);
	}
};

