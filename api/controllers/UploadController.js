// The main controller for handling uploading to clients

var fs = require('fs');
var path = require('path');
var ptn = require('parse-torrent-name');
var trakt = require('trakt-api')(sails.config.trakt_api_key, {extended: "full,images"});

var base_path = '/data/media'

module.exports = {
    uploadMovie: function (req, res) {
        var name = req.body['name'];
        var trakt_id = req.body['trakt_id'];
        var poster = req.body['poster'];
        var cover = req.body['cover'];
        var description = req.body['description'];
        var year = req.body['year'];

        if(trakt_id === null || trakt_id === undefined || !name || !year){
            return res.send(400)
        }

        Movie.create({
            name: name,
            trakt_id: trakt_id,
            poster: poster,
            cover: cover,
            description: description,
            year: year,
        }).exec(function(err, movie){
            req.file('file').upload({
                maxBytes: 0
            }, function (err, uploadedFiles) {
                if(!err && uploadedFiles.length > 0){

                    var filename = uploadedFiles[0].filename;
                    var filePath = uploadedFiles[0].fd

                    var extension = filename.split('.').pop();
                    var newFileName = name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_(' + year + ').' + extension;
                    var newPath = path.join(base_path, newFileName);
                    fs.rename(filePath, newPath, function(err){

                        if(!err){
                            Video.create({
                                file: newPath
                            }).exec(function(err, video){
                                movie.video = video.id;
                                movie.save(function(err, obj){
                                    if(!err){
                                        res.send(200, movie);
                                    }else{
                                        res.send(500);
                                    }
                                });
                            });
                        }else{
                            sails.log.error(err);
                            res.send(500);
                        }
                    });
                }else{
                    sails.log.error(err);
                    res.send(503, err);
                }
            });
        });
    },

    autofillMovie: function(req, res){
        var filename = req.param("filename");
        if(!filename){
            res.send(400);
        }else{
            var parsed = ptn(filename);

            if(!parsed.year || !parsed.title){
                return res.json({});
            }else{
                trakt.searchMovie(parsed.title, parsed.year).then(function(results){
                    if(results.length > 0){
                        var result = results[0].movie;
                        res.json({
                            name: result.title,
                            year: result.year,
                            trakt_id: result.ids.trakt,
                            description: result.overview,
                            poster: result.images.poster.thumb,
                            cover: result.images.fanart.medium
                        });
                    }else{
                        res.json({});
                    }
                }).catch(function(err){
                    sails.log.error(err);
                    res.json({});
                });
            }
        }
    },

    uploadShow: function (req, res) {
        console.log('hey')
        res.send(200);
    },

    autofillShow: function(req, res){
        var filename = req.param("filename");
        if(!filename){
            res.send(400);
        }else{
            var parsed = ptn(filename);

            if(!parsed.title || !parsed.season){
                return res.json({});
            }else{
                var promise;
                if(parsed.year){
                    promise = trakt.searchShow(parsed.title, parsed.year);
                }else{
                    promise = trakt.searchShow(parsed.title);
                }

                promise.then(function(results){
                    var show = results[0].show;
                    return trakt.season(show.ids.trakt, parsed.season).then(function(season){
                    	var reduced = season.map(function(item){
                    		return {
                    			name: item.title,
                    			episode: item.number,
                    			trakt_id: item.ids.trakt,
                    			description: item.overview,
                    			screenshot: item.images.screenshot.medium
                    		};
                    	});
                        res.json({
                        	name: show.title,
                        	trakt_id: show.ids.trakt,
                        	description: show.overview,
                        	poster: show.images.poster.thumb,
                        	cover: show.images.fanart.medium,
                        	episodes: reduced
                        });
                    }).catch(function(err){
                    	sails.log.error(err);
                        res.json({});
                    })
                }).catch(function(err){
                    sails.log.error(err);
                    res.json({});
                });
            }
        }
    }
}
