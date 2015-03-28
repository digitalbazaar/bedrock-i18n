# bedrock-i18n

A [bedrock][] module that adds minimal internationalization support to
[bedrock-express][].

**bedrock-i18n** is built using [i18n][]. When bedrock starts, (the
`bedrock.start` event), it will scan all paths in
`bedrock.config.express.static` looking for root directories that are named
after [ISO 639-1][] codes. Each matching directory is cached to be used later
for language-specific HTTP requests. Specifically, when an HTTP request is made
with an `Accept-Language` header, if the matching language is in the cache and
the requested URL matches a path in that directory, the language-specific file
is returned in the response.

## Quick Examples

```
npm install bedrock-i18n
```

```js
var bedrock = require('bedrock');

require('bedrock-server');
require('bedrock-express');
require('bedrock-i18n');

bedrock.start();
```

## Configuration

For more documentation on configuration see [config.js](https://github.com/digitalbazaar/bedrock-i18n/blob/master/lib/config.js).


[bedrock]: https://github.com/digitalbazaar/bedrock
[bedrock-express]: https://github.com/digitalbazaar/bedrock-express
[i18n]: https://github.com/mashpie/i18n-node
[ISO 639-1]: http://en.wikipedia.org/wiki/ISO_639-1
