/*
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
========================================
========================================
========================================
----------------------------------------
USWDS SASS GULPFILE
----------------------------------------
*/

var autoprefixer  = require('autoprefixer');
var autoprefixerOptions = require('./node_modules/uswds-gulp/config/browsers');
var cssnano       = require('cssnano');
var gulp          = require('gulp');
var mqpacker      = require('css-mqpacker');
var notify        = require('gulp-notify');
var path          = require('path');
var pkg           = require('./node_modules/uswds/package.json');
var postcss       = require('gulp-postcss');
var rename        = require('gulp-rename');
var replace       = require('gulp-replace');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var uswds         = require('./node_modules/uswds-gulp/config/uswds');

/*
----------------------------------------
PATHS
----------------------------------------
- All paths are relative to the
  project root
- Don't use a trailing `/` for path
  names
----------------------------------------
*/

// Project Sass source directory
const PROJECT_SASS_SRC = './src/scss';

const PROJECT_JS_SRC = './src/js';

// Images destination
const IMG_DEST = './static/img';

// Javascript destination
const JS_DEST = './static/js';

// Compiled CSS destination
const CSS_DEST = './static/css';

/*
----------------------------------------
TASKS
----------------------------------------
*/

gulp.task('copy-uswds-setup', () => {
  return gulp.src(`${uswds}/scss/theme/**/**`)
  .pipe(gulp.dest(`${PROJECT_SASS_SRC}`));
});

gulp.task('copy-uswds-images', () => {
  return gulp.src(`${uswds}/img/**/**`)
  .pipe(gulp.dest(`${IMG_DEST}`));
});

gulp.task('copy-uswds-js', () => {
  return gulp.src(`${uswds}/js/**/**`)
  .pipe(gulp.dest(`${JS_DEST}`));
});

gulp.task('copy-plandoc-js', () => {
  return gulp.src(`${PROJECT_JS_SRC}/*.js`)
  .pipe(gulp.dest(`${JS_DEST}`));
});

gulp.task('build-sass', function(done) {
  var plugins = [
    // Autoprefix
    autoprefixer(autoprefixerOptions),
    // Pack media queries
    mqpacker({ sort: true }),
    // Minify
    cssnano(({ autoprefixer: { browsers: autoprefixerOptions }}))
  ];
  return gulp.src([
      `${PROJECT_SASS_SRC}/*.scss`
    ])
    .pipe(replace(
      /\buswds @version\b/g,
      'uswds v' + pkg.version
    ))
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass({
        includePaths: [
          `${PROJECT_SASS_SRC}`,
          `${uswds}/scss`,
          `${uswds}/scss/packages`,
        ]
      }))
    .pipe(postcss(plugins))
    .pipe(gulp.dest(`${CSS_DEST}`))
    .pipe(sourcemaps.write('.'))
    .pipe(notify({
      "sound": "Pop" // case sensitive
    }));
});

gulp.task('init', gulp.series(
  'copy-uswds-setup',
  'copy-uswds-images',
  'copy-uswds-js',
  'copy-plandoc-js',
  'build-sass',
));

gulp.task('build', gulp.series(
  'copy-uswds-images',
  'copy-uswds-js',
  'copy-plandoc-js',
  'build-sass',
));

gulp.task('do-watch', function () {
  gulp.watch(`${PROJECT_SASS_SRC}/**/*.scss`, gulp.series('build-sass'));
  gulp.watch(`${PROJECT_JS_SRC}/*.js`, gulp.series('copy-plandoc-js'));
});

gulp.task('watch', gulp.series('build-sass', 'copy-plandoc-js', 'do-watch'));

gulp.task('default', gulp.series('watch'));
