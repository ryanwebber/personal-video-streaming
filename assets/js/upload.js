$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var MovieUploader = function($el){
	
	$("#uploader", $el).dropzone({
		url: "/upload/movie",
		uploadMultiple: false,
		clickable: true,
		autoProcessQueue: false,
		accept: function(file, done) {
		    if (file.name.toLowerCase().trim().split('.').pop() !== "mp4") {
				done("File must be an mp4.");
		    }
		    else {
		    	done();
		    }
		},
		uploadprogress: function(file, progress, bytesSent) {
			console.log(progress)
		},
		success: function(){
			console.log("DONE!")
		},
		init: function(){
			this.on('addedfile', function(file){
				console.log(file.name);
				this.processQueue()	
			});
		}
	})

	return {};
}