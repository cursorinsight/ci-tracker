var gulp = require('gulp')
var standard = require('gulp-standard')

gulp.task('check', ['check:standard'])

// TODO: split app js code and gulp tasks
gulp.task('check:standard', function () {
  return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
    .pipe(standard())
    .pipe(standard.reporter('default', { breakOnError: true }))
})
