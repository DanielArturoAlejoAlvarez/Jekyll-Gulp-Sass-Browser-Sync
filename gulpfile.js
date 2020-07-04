const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cp = require('child_process');
const flatten = require('gulp-flatten');
const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
const source = require('vinyl-source-stream');
//const concatjs = require('gulp-concat');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

const paths = {
  styles: {
    src: 'assets/css/main.scss',
    dest: '_site/assets/css',
    destsecond: 'assets/css'
  },
  scripts: {
    src: 'assets/js/main.js',
    dest: '_site/assets/js',
    destsecond: 'assets/js'
  },
  htmls: {
    src: '_pugfiles/**/*.pug',
    dest: '_includes/'
  }
};

function jekyllBuild() {
    return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
}

function style() {
  return gulp.src(paths.styles.src)
    .pipe(sass({
      includePaths: ['css'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(paths.styles.destsecond));
}

function js() {
  return gulp.src(paths.scripts.src)
  .pipe(rename({suffix: '.min'}))
  .pipe(uglify())
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.reload({stream:true}))
  .pipe(gulp.dest(paths.scripts.destsecond));
}

function html() {
  return gulp.src(paths.htmls.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.htmls.dest))
    .pipe(browserSync.reload({stream:true}))
}

function browserSyncServe(done) {
  browserSync.init({
    server: {
      baseDir: "_site"
    },
    notify: false
  })
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch(['assets/css/**/*.scss','assets/css/**/*.sass'], style)
  gulp.watch(['assets/js/**/*.js', '!assets/js/**/*.min.js'], js)
  gulp.watch(paths.htmls.src, html)
  gulp.watch(
    [
    '*.html',
    '_layouts/*.html',
    '_includes/*'
  ],
  gulp.series(jekyllBuild, browserSyncReload));
}

gulp.task('default', gulp.parallel(jekyllBuild, browserSyncServe, watch))
