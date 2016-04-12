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
			Episode.subscribe(req, req.param("ids"));
		}
		res.send(200);
	},
	prepare: function(req, res){
		var name = req.body.name;
		var description = req.body.description;
		var cover = req.body.cover;
		var poster = req.body.poster;
		var trakt_id = req.body.trakt_id;

		if(!name){
			return res.send(400);
		}

		Show.findOrCreate({
			name: name,
			trakt_id: trakt_id
		}, {
			name: name,
			trakt_id: trakt_id,
			description: description,
			cover: cover,
			poster: poster
		}).exec(function(err, show){
			if(!err && show){
				res.json(show);
			}else{
				res.send(500);
			}
		});
	}
};

