# Jekyll-Gulp-Sass-Browser-Sync
## Description

This application contains an automated framework system for the development and design of web pages. We will use Jekyll created in Ruby, Sass, Pug and BrowserSync.

## Installation
Using Jekyll,Sass etc preferably.

```html
$ gem install bundler jekyll
```

## Usage
```html
$ git clone https://github.com/DanielArturoAlejoAlvarez/Jekyll-Gulp-Sass-Browser-Sync.git [NAME APP]

$ npm install

$ gulp
```
Follow the following steps and you're good to go! Important:


![alt text](https://i1.wp.com/css-tricks.com/wp-content/uploads/2015/08/bs-change-bg.gif)

## Scaffold
```
+-- _includes
|   +-- header.html
|   +-- columns.html
+-- _layouts
|   +-- default.html
|   +-- posts.html
+-- _pugfiles
|   +-- header.pug
|   +-- columns.pug
+-- _site
|   +-- assets
+-- _assets
    +-- css
        +-- 0-tools
        |   +-- normalize.scss
        +-- 1-base
        +-- 2-modules
        +-- 3-sections
        |   +-- _header.sass
        |   +-- _about.sass
        +-- 4-layouts
        |   +-- home.sass
    |   +-- main.scss
    +-- img
    +-- js

+-- node_modules
+-- _config.yml
+-- .gitignore
+-- package.json
+-- 404.html
+-- index.html
+-- README.md
```

## Coding

### Config (gulpfile.js)

```javascript
...
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

...
```



## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/DanielArturoAlejoAlvarez/Jekyll-Gulp-Sass-Browser-Sync. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.


## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
