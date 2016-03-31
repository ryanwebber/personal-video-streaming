// The main controller for handling uploading to clients

var fs = require('fs');
var path = require('path');
var ptn = require('parse-torrent-name');
var trakt = require('trakt-api')(sails.config.trakt_api_key);

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

        req.file('file').upload(function (err, uploadedFiles) {
            if(!err && uploadedFiles.length > 0){
                var file = uploadedFiles[0];
                console.log(file);
                return res.send(200);

                var extension = filename.split('.').pop();
                var newFileName = name.trim().toLowerCase().replace(/\s+/g, '.') + '.(' + year + ').' + extension;
                var newPath = path.join(base_path, newFileName);
                fs.rename(filename, newPath, function(err){
                    console.log(newPath)

                    Video.create({
                        file: newPath
                    }).exec(function(err, video){
                        Movie.create({
                            name: name,
                            trakt_id: trakt_id,
                            poster: poster,
                            cover: cover,
                            description: description,
                            year: year,
                            video: video.id
                        }).exec(function(err, movie){
                            // TODO socket notification
                        });
                    });
                });
            }else{
                res.send(503, err);
            }
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
    }
}
