# ci-tracker

`ci-tracker` is a wrapper project that manages [ci-trap][github/ci-trap] (e.g.:
start data collector, set meta information and manage cookies).

## Getting Started

### Installation

Copy the minified JavaScript file from the dist directory to your project.
Insert the following code to the end of your application HTML file.

```html
<script>
var _ctt = _ctt || [];
_ctt.push(['setUrl', (("https:"==document.location.protocol)?"https:":"http:")+'your_sink.com']);
(function(d,u){
  u=((("https:"==document.location.protocol)?"https:":"http:")+"//"+u+"/");
  var g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.defer=true; g.async=true; g.src=u+'tracker.min.js';
  s.parentNode.insertBefore(g,s);})(document,'your_script_host_url.com');
</script>
```

## Development

### Prerequisites

You need [node](https://nodejs.org) (>=4.0.0) and [npm](https://www.npmjs.com)
(>=3.0.0) for development.

### Installation

Install dependencies with [NPM](https://www.npmjs.org):
```
npm install
```

## Example

The following command will start a webserver that serves example applications
at http://localhost:8100.
```
npm run gulp serve
```

## License

ci-tracker is released under the
[MIT license](https://github.com/cursorinsight/ci-tracker/blob/master/LICENSE.md).

[github/ci-trap]: https://github.com/cursorinsight/ci-trap
