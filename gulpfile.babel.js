const gulp = require('gulp');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();
const rimraf = require('rimraf');
const panini = require('panini');

function html() {
  return gulp
    .src('src/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('dist'));
}

function clean(done) {
  return rimraf('./dist', done);
}

function copyImages() {
  return gulp.src('src/img/**/*').pipe(gulp.dest('dist/img'));
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
    .pipe(gulp.dest('dist'));
}

function css() {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}

function scripts() {
  return gulp.src('src/js/**/*.js').pipe(gulp.dest('dist/js'));
}

function serve(done) {
  browserSync.init({
    server: 'dist'
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch('src/img/**/*', copyImages);
  gulp.watch('src/scss/*.scss').on('all', gulp.series(css, reload));
  gulp
    .watch('src/{layouts,partials}/**/*.html')
    .on('all', gulp.series(resetPages, pages, reload));
  gulp.watch('./src/pages/**/*.html').on('all', gulp.series(pages, reload));
  gulp.watch('src/assets/img/**/*').on('all', gulp.series(copyImages, reload));
  gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(scripts, reload));
}

gulp.task(
  'default',
  gulp.series(
    clean,
    gulp.parallel([pages, css, scripts, copyImages]),
    serve,
    watch
  )
);
