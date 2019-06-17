'use strict';

var browserSync = require('browser-sync'),
  cleanCSS = require('gulp-clean-css'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  prefixer = require('gulp-autoprefixer'),
  reload = browserSync.reload,
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  watch = require('gulp-watch'),
  save = require('gulp-save'),
  rtlcss = require('gulp-rtlcss'),
  webpack = require('webpack-stream'),
  runSequence = require('run-sequence');

var path = {
  src: {
    js: 'src/js/*.js',
    style: [
      'src/style/*.scss',
      '!src/style/**/scsslint_tmp*.scss'
    ],
    img: 'src/images/**/*.*',
    fonts: [
      'src/fonts/*.*',
      'node_modules/font-awesome/fonts/fontawesome-webfont.woff',
      'node_modules/font-awesome/fonts/fontawesome-webfont.woff2'
    ]
  },
  build: {
    js: 'groovy-menu/assets/js/',
    css: 'groovy-menu/assets/style/',
    img: 'groovy-menu/assets/images/',
    fonts: 'groovy-menu/assets/fonts/'
  },
  watch: {
    js: 'src/js/**/*.js',
    style: 'src/style/**/*.scss',
    img: 'src/images/**/*.*'
  }
};

var serverConfig = {
  proxy: 'gm-free.local',
  notify: false
};

var envConfig = {
  production: !!gutil.env.production,
  sourceMaps: !gutil.env.production
};

gulp.task('webserver', function () {
  browserSync(serverConfig);
});

gulp.task('js:build', function () {
  return gulp.src(path.src.js)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({ stream: true }));
});

gulp.task('style:build', function () {
  return gulp.src(path.src.style)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(save('for-rtl')) // Save the current stream for RTL
    // .pipe(envConfig.production ? cleanCSS() : gutil.noop())
    .pipe(gulp.dest(path.build.css))

    // RTL
    .pipe(save.restore('for-rtl'))
    .pipe(rtlcss())
    .pipe(rename({suffix: '-rtl'}))
    // .pipe(envConfig.production ? cleanCSS() : gutil.noop())
    .pipe(gulp.dest(path.build.css))

    .pipe(reload({ stream: true }));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({ stream: true }));
});

gulp.task('fonts:build', function () {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(reload({ stream: true }));
});

gulp.task('build', [
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function () {

  watch([ path.watch.style ], function () {
    gulp.start('style:build');
  });

  watch(path.watch.js, function () {
    gulp.start('js:build');
  });

  watch([ path.watch.img ], function () {
    gulp.start('image:build');
  });

});

gulp.task('default', function() {
  runSequence('build', 'webserver', 'watch');
});
