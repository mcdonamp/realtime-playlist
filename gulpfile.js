var gulp = require('gulp'),
    connect = require('gulp-connect'),
    open = require("gulp-open"),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    nodemon = require('gulp-nodemon'),
    port = process.env.port || 4000;

// browserify and transform JSX
gulp.task('browserify', function() {
    gulp.src('./app/src/js/main.js')
      .pipe(browserify({transform: 'reactify'}))
      .pipe(gulp.dest('./app/dist/js'));
});

// launch browser in a port
gulp.task('open', function(){
  var options = {
    url: 'http://localhost:' + port,
  };
  gulp.src('./app/index.html')
  .pipe(open('', options));
});

// live reload server
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: port,
    livereload: true
  });
});

// live reload js
gulp.task('js', function () {
  gulp.src('./app/dist/**/*.js')
    .pipe(connect.reload());
});

// live reload html
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

gulp.task('less', function() {
  gulp.src('./app/src/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./app/dist/css'));
});

// copy fonts from bootstrap
gulp.task('fonts', function(){
  gulp.src('./bower_components/bootstrap-less/fonts/glyphicons-halflings-regular.**')
    .pipe(gulp.dest('./app/dist/fonts'));
});

// watch files for live reload
gulp.task('watch', function() {
    gulp.watch('app/dist/js/*.js', ['js']);
    gulp.watch('app/index.html', ['html']);
    gulp.watch('app/src/less/**/*.less', ['less', 'html']);
    gulp.watch('app/src/js/**/*.js', ['browserify']);
});

// run auth server
gulp.task('auth', function() {
  nodemon({
    script: './auth/auth.js',
    ext: 'html js'
  });
});

gulp.task('process', function() {
  nodemon({
    script: './process/playlist.js',
    ext: 'js'
  });
});

gulp.task('default', ['browserify', 'less', 'fonts']);

gulp.task('serve', ['browserify', 'connect', 'open', 'watch', 'fonts']);