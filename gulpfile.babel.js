const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const rimraf = require('rimraf');
const panini = require('panini');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const webpack2 = require('webpack');
const named = require('vinyl-named');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');

function html() {
  return gulp
    .src('src/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('public'));
}

function clean(done) {
  return rimraf('public', done);
}

function images() {
  return gulp
    .src('src/img/**/*')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest('public/img'));
}

function pages() {
  return gulp
    .src('src/pages/**/*.html')
    .pipe(
      panini({
        root: 'src/pages/',
        layouts: 'src/layouts/',
        partials: 'src/partials/',
        data: 'src/data/',
        helpers: 'src/helpers/'
      })
    )
    .pipe(gulp.dest('public'))
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('public'));
}

function css() {
  return gulp
    .src('src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ compatibility: 'ie9' }))
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}

const webpackConfig = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};

function scripts() {
  return gulp
    .src('src/js/**/*.js')
    .pipe(named())
    .pipe(sourcemaps.init())
    .pipe(webpackStream(webpackConfig, webpack2))
    .pipe(
      uglify().on('error', e => {
        console.log(e);
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
}

function serve(done) {
  browserSync.init({
    server: 'public'
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch('src/img/**/*', images);
  gulp.watch('src/scss/*.scss').on('all', gulp.series(css, reload));
  gulp
    .watch('src/{layouts,partials}/**/*.html')
    .on('all', gulp.series(resetPages, pages, reload));
  gulp.watch('./src/pages/**/*.html').on('all', gulp.series(pages, reload));
  gulp.watch('src/img/**/*').on('all', gulp.series(images, reload));
  gulp.watch('src/js/**/*.js').on('all', gulp.series(scripts, reload));
}

gulp.task(
  'default',
  gulp.series(clean, gulp.parallel([pages, css, scripts, images]), serve, watch)
);
gulp.task(
  'build',
  gulp.series(clean, gulp.parallel([pages, css, scripts, images]))
);
