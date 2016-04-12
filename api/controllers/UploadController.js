// The main controller for handling uploading to clients

var fs = require('fs');
var path = require('path');
var ptn = require('parse-torrent-name');
var trakt = require('trakt-api')(sails.config.trakt_api_key, {extended: "full,images"});

var base_path = '/data/media';

module.exports = {
    uploadMovie: function (req, res) {
        var name = req.body['name'];
        var trakt_id = req.body['trakt_id'];
        var poster = req.body['poster'];
        var cover = req.body['cover'];
        var description = req.body['description'];
        var year = req.body['year'];

        if(!name || !year){
            return res.send(400);
        }

        Movie.create({
            name: name,
            trakt_id: trakt_id,
            poster: poster,
            cover: cover,
            description: description,
            year: year,
        }).exec(function(err, movie){
            Movie.publishCreate(movie);
            var progress = null;
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
                                        Movie.publishUpdate(movie.id, {
                                            video: video
                                        });
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
            }).on('progress', function(state){
                var byteCount = state.stream.byteCount;
                var written = state.written;
                var newProgress = Math.floor(100 * (written / byteCount));
                if(newProgress != progress){
                    progress = newProgress;
                    sails.sockets.blast('upload.progress', { 
                        progress: progress,
                        id: movie.id
                    });
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

        var seasonNumber = req.body['season'];
        var show_id = req.body['show_id'];

        if(!show_id || !seasonNumber){
            return res.send(400);
        }

        var episode_name = req.body['episode_name'];
        var episode_trakt_id = req.body['episode_trakt_id'];
        var episode_screenshot = req.body['episode_screenshot'];
        var episode_description = req.body['episode_description'];
        var episode_number = req.body['episode_number'];

        if(!episode_name || !episode_number){
            return res.send(400);
        }

        Show.findOne({
            id: show_id,
        }).exec(function(err, show){

            var name = show.name;

            if(!err && show){
                console.log(show);

                Season.findOne({
                    show: show.id,
                    seasonNumber: seasonNumber
                }).exec(function(err, season){
                    if(!err && season){
                        Episode.create({
                            name: episode_name,
                            trakt_id: episode_trakt_id,
                            screenshot: episode_screenshot,
                            description: episode_description,
                            episodeNumber: episode_number,
                            seasonNumber: seasonNumber,
                            season: season,
                            show: show
                        }).exec(function(err, episode){
                            if(!err && episode){
                                req.file('file').upload({
                                    maxBytes: 0
                                }, function (err, uploadedFiles) {
                                    if(!err && uploadedFiles.length > 0){

                                        var filename = uploadedFiles[0].filename;
                                        var filePath = uploadedFiles[0].fd

                                        var extension = filename.split('.').pop();
                                        var newFileName = name.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_(' + episode.sXeX() + ').' + extension;
                                        var newPath = path.join(base_path, newFileName);
                                        fs.rename(filePath, newPath, function(err){

                                            if(!err){
                                                Video.create({
                                                    file: newPath
                                                }).exec(function(err, video){
                                                    episode.video = video.id;
                                                    episode.save(function(err, obj){
                                                        if(!err){
                                                            Episode.publishUpdate(episode.id, {
                                                                video: video
                                                            });
                                                            res.send(200, episode);
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
                                }).on('progress', function(state){

                                });
                            }else{
                                sails.log.error(err);
                                res.send(500);
                            }
                        });
                    }else{
                        sails.log.error(err);
                        res.send(500);
                    }
                });
            }else{
                sails.log.error(err);
                return res.send(503, err);
            }
        });
    },

    autofillShow: function(req, res){
        var filenames = req.param("filenames");
        if(!filenames){
            res.send(400);
        }else{
            var parsed = []
            for(var file in filenames){
                var p = ptn(filenames[file]);
                p.filename = filenames[file];
                parsed.push(p);
            }

            if(parsed.length < 1){
                return res.json({});
            }

            var example = parsed[0];

            if(!example.title || !example.season){
                return res.json({});
            }else{
                var promise = trakt.searchShow(example.title).then(function(results){
                    var show = results[0].show;
                    return trakt.season(show.ids.trakt, example.season).then(function(season){
                        var reduced = season.map(function(item){
                            return {
                                name: item.title,
                                episode: item.number,
                                trakt_id: item.ids.trakt,
                                description: item.overview,
                                screenshot: item.images.screenshot.medium
                            };
                        });

                        var results = {};
                        for(var given in parsed){
                            var preFilled = parsed[given];
                            var filled = reduced.find(function(elem){
                                return elem.episode === preFilled.episode;
                            });
                            if(filled){
                                results[preFilled.filename] = filled;
                            }
                        }

                        res.json({
                            name: show.title,
                            trakt_id: show.ids.trakt,
                            description: show.overview,
                            poster: show.images.poster.thumb,
                            cover: show.images.fanart.medium,
                            season: example.season,
                            episodes: results
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
