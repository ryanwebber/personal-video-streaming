/**
 * ShowController
 *
 * @description :: Server-side logic for managing shows
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updates: function(req, res){
		if(req.isSocket){
			Show.watch(req);
			Season.watch(req);
			Episode.watch(req);
		}
		res.send(200);
	}
};

