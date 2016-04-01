define(['react', 'jquery'], 
    function (React, $) {
    	var Gobbler = function(dataSource, step, todo){

			var deferred = $.Deferred();
			var run = function(obj){
				if(!!obj){
					todo(obj).done(function(response){
						step(obj, response);
					}).fail(function(err){
						// TODO report
					}).always(function(response){
						run(dataSource());
					});
				}else{
					deferred.resolve();
				}
			}

			run(dataSource());
			return deferred;
		};

		var UploadQueue = function(files, options){
			var noop = function(){};
			var defaults = function(a, def){
				if(a === undefined || a === null){
					return def;
				}else{
					return a;
				}
			}

			this.options = {
				url: options.url,
				fieldName: defaults(options.fieldname, "file"),
				fileData: defaults(options.fileData, function(){return {}}),
				simultaneousUploads: defaults(options.simultaneousUploads, 3),
				beforeFileUpload: defaults(options.beforeFileUpload, noop).bind(this),
				onFileComplete: defaults(options.onFileComplete, noop).bind(this),
				onSuccess: defaults(options.onSuccess, noop).bind(this),
			}

			this.getFiles = function(){
				return files;
			};

			this.uploadFile = function(file){
				var data = new FormData();
				var props = this.options["fileData"](file);
				for(key in props){
					data.append(key, props[key]);
				}
				data.append(this.options["fieldName"], file);

				return $.ajax({
				    url: this.options["url"],
				    data: data,
				    cache: false,
				    contentType: false,
				    processData: false,
				    type: 'POST',
				    success: noop
				});
			}

			this.submit = function(){
				var _this = this;
				var queue = this.getFiles()
				var originalFileCount = queue.length
				var promises = []

				var totalBytes = remainingBytes = queue.reduce(function(total, file){
					return total + file.size;
				}, 0);

				for(var i =0; i<Math.min(this.options["simultaneousUploads"], queue.length); i++){
					promises.push(new Gobbler(function(){
						var obj = queue.shift()
						if(obj){
							_this.options["beforeFileUpload"](obj, queue.length + 1);
						}
						return obj;
					}, function(last, response){
						remainingBytes -= last.size;
						_this.options["onFileComplete"](last, queue.length, remainingBytes / totalBytes);
					},function(file){
						return _this.uploadFile(file);
					}));
				}

				$.when.apply(_this, promises).then(function(){
					_this.options["onSuccess"]();
				});

				return _this;
			};

			return this;
		};

		return UploadQueue;
    }
);