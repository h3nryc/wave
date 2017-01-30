/**
 * Module dependencies
 */

var Promise = require('promise');
var requiresdk = require('require-sdk');
var sdk;

/**
 * Expose SCStream
 */

module.exports = SCStream;


/**
 * Initialize a new `SCStream` instance and authenticate with SoundCloud API
 *
 * @param {String} clientId
 * @api public
 */

function SCStream(clientId) {
  if (!(this instanceof SCStream)) return new SCStream(clientId);
  sdk = requiresdk('http://connect.soundcloud.com/sdk.js', 'SC');
  this.authenticateClient(clientId);
}

/**
 * Register a new SoundCloud API `clientId`. Required for retrieving track information.
 *
 * @param {String} clientId
 * @api private
 */

SCStream.prototype.authenticateClient = function(clientId) {
  sdk(function loadAPI(err) {
    if (err) throw new Error('SoundCloud API failed to load');
    window.SC.initialize({client_id: clientId});
  });
};

/**
 * Retrieve a `track`s information and create a stream.
 *
 * @param {String} track url to be played
 * @param {Boolean} [staggered] return stream as a promise
 * @return {Promise} loaded track information and stream promise
 * @api public
 */

SCStream.prototype.stream = function(track, staggered) {
  var _this = this;

  if (staggered) {
    return this.getTrackInfo(track).then(function(data) {
      return {
        data: data,
        stream: _this.createStream(data, true)
      };
    });
  } else {
    return this.getTrackInfo(track).then(this.createStream);
  }
};

/**
 * Retrieve track information for `track`.
 *
 * @param {String} track url to be played
 * @return {Promise}
 * @api public
 */

SCStream.prototype.getTrackInfo = function(track) {
  return new Promise(function(resolve, reject) {
    sdk(function loadAPI(err) {
      window.SC.get('/resolve', {url: track}, resolve);
    });
  });
};

/**
 * Create a new audio stream.
 *
 * @param {Object} track data object
 * @param {Boolean} [streamOnly] resolve stream by itself
 * @return {Promise}
 * @api public
 */

SCStream.prototype.createStream = function(data, streamOnly) {
  return new Promise(function(resolve, reject) {
    sdk(function loadAPI(err) {
      window.SC.stream(data.stream_url, function(stream) {
        var response = streamOnly ? stream : {data: data, stream: stream};
        resolve(response);
      });
    });
  });
};
