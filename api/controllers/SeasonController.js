/**
 * SeasonController
 *
 * @description :: Server-side logic for managing seasons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	prepare: function(req, res){
		var show = req.body.show;
		var seasonNumber = req.body.seasonNumber;

		if(!show || !seasonNumber){
			return res.send(400);
		}

		Season.findOrCreate({
			show: show,
			seasonNumber: seasonNumber
		}).exec(function(err, season){
			if(!err && season){
				res.json(season);
			}else{
				res.send(500);
			}
		});
	}
};

