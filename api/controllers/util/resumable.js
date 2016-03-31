var fs = require('fs'), path = require('path'), util = require('util'), Stream = require('stream').Stream;



module.exports = resumable = function(temporaryFolder){
  var $ = this;
  $.temporaryFolder = temporaryFolder;
  $.maxFileSize = null;
  $.fileParameterName = 'file';

  try {
    fs.mkdirSync($.temporaryFolder);
  }catch(e){}

  $.currentUploads = {}

  var cleanIdentifier = function(identifier){
    return identifier.replace(/^0-9A-Za-z_-/img, '');
  }

  var getChunkFilename = function(chunkNumber, identifier){
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);
    // What would the file name be?
    return path.join($.temporaryFolder, './resumable-'+identifier+'.'+chunkNumber);
  }

  var validateRequest = function(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize){
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);

    // Check if the request is sane
    if (chunkNumber==0 || chunkSize==0 || totalSize==0 || identifier.length==0 || filename.length==0) {
      return 'non_resumable_request';
    }
    var numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);
    if (chunkNumber>numberOfChunks) {
      return 'invalid_resumable_request1';
    }

    // Is the file too big?
    if($.maxFileSize && totalSize>$.maxFileSize) {
      return 'invalid_resumable_request2';
    }

    if(typeof(fileSize)!='undefined') {
      if(chunkNumber<numberOfChunks && fileSize!=chunkSize) {
        // The chunk in the POST request isn't the correct size
        return 'invalid_resumable_request3';
      }
      if(numberOfChunks>1 && chunkNumber==numberOfChunks && fileSize!=((totalSize%chunkSize)+chunkSize)) {
        // The chunks in the POST is the last one, and the fil is not the correct size
        return 'invalid_resumable_request4';
      }
      if(numberOfChunks==1 && fileSize!=totalSize) {
        // The file is only a single chunk, and the data size does not fit
        return 'invalid_resumable_request5';
      }
    }

    return 'valid';
  }

  //'partly_done', filename, original_filename, identifier
  //'done', filename, original_filename, identifier
  //'invalid_resumable_request', null, null, null
  //'non_resumable_request', null, null, null
  $.post = function(req, file, callback){
    var fields = req.body;
    var files = req.file;

    var chunkNumber = fields['resumableChunkNumber'];
    var chunkSize = fields['resumableChunkSize'];
    var totalSize = fields['resumableTotalSize'];
    var identifier = cleanIdentifier(fields['resumableIdentifier']);
    var filename = fields['resumableFilename'];
    var numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);
		var original_filename = fields['resumableIdentifier'];

    if(!file || !file.size) {
      callback('invalid_resumable_request', null, null, null);
      return;
    }

    if(!$.currentUploads[identifier]){
      $.currentUploads[identifier] = {
        numChunks: numberOfChunks,
        numUploaded: 0,
      }
    }

    var validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, file.size);
    if(validation=='valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);

      // Save the chunk (TODO: OVERWRITE)
      fs.rename(file.fd, chunkFilename, function(){
        $.currentUploads[identifier].numUploaded += 1
        if($.currentUploads[identifier].numUploaded == $.currentUploads[identifier].numChunks){
          sails.log.verbose("Done Uploading", identifier)
          var filePath = path.join($.temporaryFolder, './'+filename)
          var stream = fs.createWriteStream(filePath)
          $.currentUploads[identifier] = undefined
          $.write(identifier, stream, {
            onDone: function(){
              $.clean(identifier, {
                onDone: function(){
                  callback('done', filePath, original_filename, identifier);
                }
              })
            }
          });
        }else{
          callback('partly_done', filename, req.session.uploads[identifier].numUploaded, identifier);
        }
      });
    } else {
          callback(validation, filename, original_filename, identifier);
    }
  }


  // Pipe chunks directly in to an existsing WritableStream
  //   r.write(identifier, response);
  //   r.write(identifier, response, {end:false});
  //
  //   var stream = fs.createWriteStream(filename);
  //   r.write(identifier, stream);
  //   stream.on('data', function(data){...});
  //   stream.on('end', function(){...});
  $.write = function(identifier, writableStream, options) {
      options = options || {};
      options.end = (typeof options['end'] == 'undefined' ? true : options['end']);

      // Iterate over each chunk
      var pipeChunk = function(number) {

          var chunkFilename = getChunkFilename(number, identifier);
          fs.exists(chunkFilename, function(exists) {

              if (exists) {
                  // If the chunk with the current number exists,
                  // then create a ReadStream from the file
                  // and pipe it to the specified writableStream.
                  var sourceStream = fs.createReadStream(chunkFilename);
                  sourceStream.pipe(writableStream, {
                      end: false
                  });
                  sourceStream.on('end', function() {
                      // When the chunk is fully streamed,
                      // jump to the next one
                      pipeChunk(number + 1);
                  });
              } else {
                  // When all the chunks have been piped, end the stream
                  if (options.end) writableStream.end();
                  if (options.onDone) options.onDone();
              }
          });
      }
      pipeChunk(1);
  }


  $.clean = function(identifier, options) {
      options = options || {};

      // Iterate over each chunk
      var pipeChunkRm = function(number) {

          var chunkFilename = getChunkFilename(number, identifier);

          fs.exists(chunkFilename, function(exists) {
              if (exists) {

                  sails.log.verbose('exist removing ', chunkFilename);
                  fs.unlink(chunkFilename, function(err){
                    if(!err){
                      pipeChunkRm(number + 1);
                    }
                  });
              } else {

                  if (options.onDone) options.onDone();

              }
          });
      }
      pipeChunkRm(1);
  }

  return $;
}