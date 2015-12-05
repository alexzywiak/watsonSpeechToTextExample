'use strict';

var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
var _ = require('underscore');
var promise = require('bluebird')

var getTimestamps = function(transcriptPath) {
  return new promise(function(resolve, reject) {
    fs.readFile(transcriptPath, function(err, data) {
      if (err) {
        reject(err);
      }
      var content = data;
      var timestamps = JSON.parse(data).results[0].alternatives[0].timestamps;

      resolve(timestamps.map(function(timestamp) {
        return {
          raw: timestamp,
          word: timestamp[0],
          start: timestamp[1],
          end: timestamp[2],
          // work around for weird js decimal math
          duration: ((timestamp[2] * 100 - timestamp[1] * 100) / 100).toFixed(2)
        }
      }));
    });
  });
};

var parseAudio = function(transcriptPath, audioPath) {

  getTimestamps(transcriptPath)
    .then(function(timestamps) {
      timestamps.forEach(function(ts, idx) {
      	console.log(ts);
        ffmpeg(audioPath)
          .setStartTime(ts.start)
          .setDuration(ts.duration)
          .output('./parsed/' + ts.word + '.flac')

        .on('end', function(err) {
            if (err) return console.log(err);
            console.log('Parsed ' + ts.word);
          })
          .on('error', function(err) {
            console.log('Error ' + err);
          }).run();
      });
    });
};

parseAudio('./transcript.json', '0001.flac');
