'use strict';

var watson = require('watson-developer-cloud');
var fs = require('fs');
var config = require('./config');

var speech_to_text = watson.speech_to_text({
  username: config.username,
  password: config.password,
  version: 'v1',
  url: 'https://stream.watsonplatform.net/speech-to-text/api',
});

var params = {
  audio: fs.createReadStream('./0001.flac'),
  content_type: 'audio/flac',
  timestamps: true
};

speech_to_text.recognize(params, function(err, transcript) {
  if (err)
    console.log(err);
  else
  	fs.writeFile('transcript.json', JSON.stringify(transcript, null, 2), function(err){
  		if(err) console.log(err);
  		else 
  			console.log(transcript);
  	})
});