var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require("gulp-rename");
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

gulp.task('pug', function () {
  return gulp.src('*.pug')
    .pipe(pug())
    .pipe(gulp.dest('.'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('*.pug', ['pug']);
  gulp.watch('./js/*.js').on('change', browserSync.reload);
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('default', ['sass', 'pug', 'watch', 'browser-sync']);
