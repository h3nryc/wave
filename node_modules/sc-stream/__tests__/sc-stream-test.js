jest.dontMock('../');

describe('SCStream', function() {
  var requiresdk = require('require-sdk');
  var SCStream = require('../');
  var sdkMock;

  beforeEach(function() {

    /**
     * Mock out API loading util
     */

    sdkMock = jest.genMockFunction().mockImplementation(function(cb) {
      return cb();
    });
    
    requiresdk.mockImplementation(function(url, cb) {
      return sdkMock;
    });

    /**
     * Mock out SoundCloud API
     */

    window.SC = {
      initialize: jest.genMockFunction(),

      get: jest.genMockFunction().mockImplementation(function(u, t, cb) {
        cb({
          stream_url: 'a streaming url'
        });
      }),

      stream: jest.genMockFunction().mockImplementation(function(url, cb) {
        cb('a stream');
      })
    };
  });

  it('should raise an error if the SoundCloud API fails to load', function() {
    sdkMock.mockImplementation(function(cb) {
      cb('error');
    });

    expect((function() {
      new SCStream();
    })).toThrow('SoundCloud API failed to load');
  });

  it('should load the SoundCloud API when initialized', function() {
    var scstream = new SCStream();

    expect(requiresdk.mock.calls[0][0]).toBe('http://connect.soundcloud.com/sdk.js');
    expect(requiresdk.mock.calls[0][1]).toBe('SC');
    expect(sdkMock.mock.calls.length).toBe(1);
  });


  it('should authenticate a new soundcloud client', function() {
    var scstream = new SCStream('sc-client-id');
    
    expect(window.SC.initialize.mock.calls[0][0].client_id).toBe('sc-client-id');
  });

  it('should retrieve track information', function() {
    var scstream = new SCStream('sc-client-id');

    scstream.getTrackInfo('https://soundcloud.com/baauer/one-touch');

    expect(window.SC.get.mock.calls[0][1].url).toBe('https://soundcloud.com/baauer/one-touch');
  });

  it('should create a new audio stream', function() {
    var scstream = new SCStream('sc-client-id');
    
    scstream.createStream({stream_url: 'a streaming url'});    
    expect(window.SC.stream.mock.calls[0][0]).toBe('a streaming url');
  });

  pit('should retrieve track info and create a stream', function() {
    var scstream = new SCStream('sc-client-id');

    return scstream.stream('https://soundcloud.com/baauer/one-touch')
      .then(function(track) {
        expect(track.data).toEqual({stream_url: 'a streaming url'});
        expect(track.stream).toBe('a stream');
      });
  });

  pit('should be able to stagger loading track info & stream', function() {
    var scstream = new SCStream('sc-client-id');

    return scstream.stream('https://soundcloud.com/baauer/one-touch', true)
      .then(function(track) {
        expect(track.data).toEqual({stream_url: 'a streaming url'});
        expect(track.stream.then).toBeDefined(); // track.stream is a promise
        return track.stream;
      })
      .then(function(stream) {
        expect(stream).toBe('a stream');
      });
  });
});
