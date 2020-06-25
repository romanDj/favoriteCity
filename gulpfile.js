'use strict';

const gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso');

sass.compiler = require('sass');

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('sass', function () {
    return gulp.src('./src/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(csso())
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
});


gulp.task('sass-watch', function () {
    browserSync.init({
        server: {
            baseDir: './',
        },
        online: true,
    });
    gulp.watch('./src/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('sass', 'sass-watch'));