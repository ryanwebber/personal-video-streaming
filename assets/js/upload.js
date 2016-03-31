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
	
	var uploader = new UploadQueue($("#uploader", $el), {
		url: "/upload/movie",
		multiple: true,
		onFilesChanged: function(files){
			for(var f in files){
				console.log("Changed:", files[f]);
			}
			this.submit()
		},
		fileData: function(file){
			return $el.serializeObject()
		},
		beforeUpload: function(file, remaining){
			console.log("Preparing: ", file.name, remaining)
		},
		onSuccess: function(){
			console.log("Done!");
		}
	});

	return {};
}