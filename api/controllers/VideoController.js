/**
 * VideoController
 *
 * @description :: Server-side logic for managing videos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	watch: function(req, res){
		var video = req.params["video_id"];
		if(!video){
			return res.send(400);
		}

		res.view("watch", {
			video: video
		});
	}
};

