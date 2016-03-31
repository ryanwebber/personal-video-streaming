// The main controller for handling uploading to clients

var fs = require('fs');
path = require('path');

var base_path = '/data/media'

module.exports = {
	uploadMovie: function (req, res) {
		var name = req.body['name'];
		var trakt_id = req.body['trakt_id'];
		var image = req.body['name'];
		var description = req.body['name'];
		var year = req.body['year'];

		if(trakt_id === null || trakt_id === undefined || !name || !year){
			return res.send(400)
		}

		req.file('file').upload(function (err, uploadedFiles) {
			if(!err && uploadedFiles.length > 0){
				var file = uploadedFiles[0];
				console.log(file);
				return res.send(200);

				var extension = filename.split('.').pop();
			var newFileName = name.trim().toLowerCase().replace(/\s+/g, '.') + '.(' + year + ').' + extension;
			var newPath = path.join(base_path, newFileName);
			fs.rename(filename, newPath, function(err){
				console.log(newPath)

				Video.create({
					file: newPath
				}).exec(function(err, video){
						Movie.create({
							name: name,
							trakt_id: trakt_id,
							image: image,
							description: description,
							year: year,
							video: video.id
						}).exec(function(err, movie){
							// TODO socket notification
						});
					});
			});
			}else{
				res.send(503, err);
			}
		});
	},

	uploadShow: function (req, res) {
		console.log('hey')
		res.send(200);
	}
}
