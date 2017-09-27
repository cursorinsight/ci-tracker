var gulp = require('gulp')
var util = require('gulp-util')
var browserify = require('gulp-browserify')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')

var buildDir = './.build'

gulp.task('build:example-tracker', ['compile-js:example-tracker', 'copy-html:example-tracker', 'copy-css:example-tracker'])

gulp.task('compile-js:example-tracker', function () {
  return gulp.src(['src/index.js'])
    .pipe(browserify({}))
    .pipe(uglify())
    .pipe(concat('tracker.min.js'))
    .pipe(gulp.dest(buildDir))
})

var exampleHTMLFiles = [
  'examples/page-*.html',
  'examples/*cors.html',
  'examples/production.html'
]
gulp.task('copy-html:example-tracker', function () {
  return gulp.src(exampleHTMLFiles)
    .pipe(gulp.dest(buildDir))
})

gulp.task('copy-css:example-tracker', function () {
  return gulp.src(['examples/example.css'])
    .pipe(gulp.dest(buildDir))
})

// server task

var port = 8100  // server port

var connect = require('connect')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var http = require('http')
var inspectHeaders = function (headers) {
  var blackList = new RegExp('^(host|accept|content-length|connection|pragma|cache-control)')
  var str = ''
  for (var key in headers) {
    if (!key.match(blackList)) {
      str += key + ': '
      str += headers[key] + '\n'
    }
  }
  return str
}

var servePreTasks = ['check', 'build:example-tracker']

gulp.task('serve', servePreTasks, function () {
  var app = connect()
              .use(bodyParser.text({'inflate': true}))
              .use(function (req, res, next) {
                if (req.method === 'POST') {
                  util.log('Motion data received (' +
                    req.body.length + ' bytes):\n' +
                    inspectHeaders(req.headers) +
                    '-----BEGIN MOTION DATA-----\n' +
                    // TODO parse motion header
                    // IE9 output will be f*cked up here
                    req.body + '\n' +
                    '-----END MOTION DATA-----')
                  res.setHeader('Access-Control-Allow-Origin', '*')
                  res.setHeader('Access-Control-Allow-Credentials', 'true')
                  res.end('ok')
                } else {
                  next()
                }
              })
              .use(serveStatic(buildDir))
  var server = http.createServer(app)

  util.log(util.colors.green('Server started on http://localhost:' + port + '/'))
  return server.listen(port)
})
