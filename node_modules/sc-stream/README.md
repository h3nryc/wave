# sc-stream

Stream a SoundCloud track.

## Features
- simple streaming
- promise based interface
- staggered track info & stream loading
- lazy API loading


## Installation

```
$ npm install sc-stream
```


## Usage

```js
var SCStream = require('sc-stream');
var sc = new SCStream('client-id');

sc.stream('https://soundcloud.com/baauer/one-touch')
  .then(function(track) {
    console.log('Playing', track.data.title);
    track.stream.play();
  });
```

# License

  MIT
