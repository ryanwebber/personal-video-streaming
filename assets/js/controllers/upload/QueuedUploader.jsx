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
				simultaneousUploads: defaults(options.simultaneousUploads, 2),
				beforeFileUpload: defaults(options.beforeFileUpload, noop).bind(this),
				onFileComplete: defaults(options.onFileComplete, noop).bind(this),
				onSuccess: defaults(options.onSuccess, noop).bind(this),
				onProgress: defaults(options.onProgress, noop).bind(this),
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
				    success: noop,
				    xhr: function() {
			            var myXhr = $.ajaxSettings.xhr();
			            if(myXhr.upload){
			                myXhr.upload.addEventListener('progress',this.onProgress.bind(this, file), false); // For handling the progress of the upload
			            }
			            return myXhr;
			        }.bind(this),
				});
			}

			this.onProgress = function(file, e){
				if(e.lengthComputable){
					var total = e.total;
					var loaded = e.loaded;
					var progress = e.loaded/e.total;
					var percent = Math.floor(progress * 100);
					this.options["onProgress"]({
						file: file,
						total: total,
						loaded: loaded,
						progress: progress,
						percent: percent
					});
			    }
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