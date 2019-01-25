const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');

const jsFiles = [
    './src/js/lib.js',
    './src/js/some.js'
];

function styles() {
    return gulp.src('./src/scss/main.scss')
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(sourcemaps.write({
                    includeContent: false,
                    sourceRoot: '.'
                }))
                .pipe(sourcemaps.init({
                    loadMaps: true
                }))
                .pipe(autoprefixer({
                    browsers: ['> 0.1%'],
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2

                }))
                .pipe(sourcemaps.write('.'))
                .pipe(gulp.dest('./build/css'))
                .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(jsFiles)
                .pipe(concat('all.js'))
                .pipe(uglify({
                    toplevel: true
                }))
                .pipe(gulp.dest('./build/js'))
                .pipe(browserSync.stream());
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        tunnel: false
    });
    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./*.html").on('change', browserSync.reload);
}

function clean() {
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('script', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean,
                        gulp.parallel(styles, scripts)
                    ));

gulp.task('dev', gulp.series('build', 'watch'));