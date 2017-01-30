var SCStream = require('../');
var Promise = require('promise');

var scstream = new SCStream('5e687b50ccc60566b71bc47a42a2b169');

/**
 * Without staggering
 */

scstream.stream('https://soundcloud.com/baauer/one-touch')
  .then(function(track) {
    console.log('received track', track.data);
    console.log('received stream', track.stream);
  });

/**
 * With staggering
 */

scstream.stream('https://soundcloud.com/baauer/one-touch', true)
  .then(function(track) {
    console.log('receving track data', track.data);
    return track.stream;
  })
  .then(function(stream) {
    console.log('receiving track stream', stream);
  });
