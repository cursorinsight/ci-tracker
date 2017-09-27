var gulp = require('gulp')

var project = require('../package.json')

var browserify = require('gulp-browserify')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')

// compile

gulp.task('dist', function () {
  return gulp.src('./src/index.js')
    .pipe(browserify({}))
    .pipe(uglify())
    .pipe(concat(project.name + '-' + project.version + '.min.js'))
    .pipe(gulp.dest('dist'))
})
