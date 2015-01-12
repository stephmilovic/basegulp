//Set your Project Details
var pkg = {
  authorName: 'SAM',
};

//Set your project path variables
var basePaths = {
  dev: 'J:/project/',
  sass: 'sass/main.scss',
  js: 'js/**/*.js',
};

//
////ONLY EDIT BELOW IF NEEDED
//
//////////////////////////////////////////////////////////////

//CSS & JS Banners
var cssBanner = ['/*',
' * App Stylesheet',
' * Created by: <%= pkg.authorName %>',
' * Please note this CSS was built with sass DO NOT EDIT',
' */',
''].join('\n');

var jsBanner = ['//',
'// App JS',
'// Created by: <%= pkg.authorName %>',
'//',
''].join('\n');


//Gulp Modules
var gulp = require('gulp'),
sass = require('gulp-sass'),
bourbon = require('node-bourbon').includePaths;
neat = require('node-neat').includePaths;
cache = require('gulp-cache'),
rename = require('gulp-rename'),
notify = require('gulp-notify'),
plumber = require('gulp-plumber'),
csslint = require('gulp-csslint'),
jshint = require('gulp-jshint'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat'),
header = require('gulp-header'),
urlAdjuster = require('gulp-css-url-adjuster'),
autoprefixer = require('gulp-autoprefixer'),
sourcemaps = require('gulp-sourcemaps');

//Sass
gulp.task('styles', function() {
  return gulp.src(basePaths.sass)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({
    style: 'expanded',
    errLogToConsole: true,
    includePaths: require('node-bourbon').includePaths,
    includePaths: require('node-neat').includePaths}))
    .pipe(gulp.dest(basePaths.dev))
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(basePaths.dev))
  });

  // Scripts
  gulp.task('scripts', function() {
    return gulp.src(basePaths.js)
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('gulp-jshint-file-reporter', {
      filename: basePaths.dev + '/jshint-output.log'
    }))
    .pipe(concat('appScripts.js'))
    .pipe(header(jsBanner, { pkg : pkg }))
    .pipe(gulp.dest(basePaths.dev))
    .pipe(notify({ message: 'Scripts task complete' }));
  });

  //Build
  gulp.task('build', function() {
    return gulp.src(basePaths.sass)
    .pipe(sass({
      style: 'compressed',
      errLogToConsole: true,
      includePaths: require('node-bourbon').includePaths,
      includePaths: require('node-neat').includePaths}))
      .pipe(autoprefixer('last 5 version'))
      .pipe(urlAdjuster({
        replace:  ['https://website.com/','/'],
      }))
      .pipe(csslint('csslintrc.json'))
      .pipe(csslint.reporter())
      .pipe(rename({ suffix: '_prod' }))
      .pipe(header(cssBanner, { pkg : pkg }))
      .pipe(gulp.dest(basePaths.dev))
      .pipe(notify({ message: 'Build task complete' }));
  });

  // Default task
  gulp.task('default', function() {
    gulp.start('styles', 'build');
  });

  // Watch
  gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('sass/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch(basePaths.js, ['scripts']);
  });
