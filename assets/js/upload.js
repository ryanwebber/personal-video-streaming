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
	var r = new Resumable({
		target:'/upload/movie/',
		query: function(){
			return {}
		}
	});

	r.assignBrowse(document.getElementById('files'));

	r.on('fileAdded', function(){
		r.upload()
	});

	r.on('progress', function(){
		console.log(Math.floor(r.progress()*100) + '%');
	});

	return {};
}