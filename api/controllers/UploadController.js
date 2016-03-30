// The main controller for handling uploading to clients
var Resumable = require('./util/resumable')
var resumable = Resumable('/up')

module.exports = {
	uploadMovie: function (req, res) {
		console.log('hey')
		resumable.post(req, function(status, filename, original_filename, identifier){
	        console.log('POST', status, original_filename, identifier);

	        res.ok("Successfully uploaded file to: " + filename)
	    });
	}
}
