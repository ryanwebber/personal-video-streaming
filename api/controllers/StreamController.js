var fs = require('fs');
var util = require('util');

// The main controller for handling streaming to clients

module.exports = {
	stream: function (req, res) {
		var video_id = req.param('video_id')
		var path = '/data/media/' + video_id + '.mp4';

		fs.access(path, fs.F_OK, function(err) {
		    if (!err) {
		        var stat = fs.statSync(path);

		        var total = stat.size;
				if (req.headers['range']) {
					var range = req.headers.range;
					var parts = range.replace(/bytes=/, "").split("-");
					var partialstart = parts[0];
					var partialend = parts[1];

					var start = parseInt(partialstart, 10);
					var end = partialend ? parseInt(partialend, 10) : total-1;
					var chunksize = (end-start)+1;
					console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

					var file = fs.createReadStream(path, {start: start, end: end});
					res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/mp4' });
					file.pipe(res);
				} else {
					console.log('ALL: ' + total);
					res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
					fs.createReadStream(path).pipe(res);
				}
		    } else {
		        res.notFound('No video file "' + video_id +'" found.');
		    }
		});
	}
}
