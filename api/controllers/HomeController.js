var diskspace = require('diskspace');

function humanFileSize(bytes) {
    var thresh = 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

// Controller for the homepage
module.exports = {
	home: function(req, res){
		var disk = sails.config.disk || "/";
		diskspace.check(disk, function (err, total, free, status){
			if(!err){
				var used = total - free;
				res.view("homepage", {
					volume: {
						total: total,
						totalString: humanFileSize(total),
						free: free,
						freeString: humanFileSize(free),
						used: used,
						usedString: humanFileSize(used),
						percentFull: Math.floor(100*used/total)
					}
				});
			}else{
				res.view("homepage");
			}
		});
	}
};