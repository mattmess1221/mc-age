const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');

let tsProject = ts.createProject('tsconfig.json');

const distFolder = './dist/';

function cleanDist() {
    return gulp.src(distFolder, {allowEmpty: true})
        .pipe(clean());
}

function dist() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(gulp.dest(distFolder))
        .pipe(tsProject())
        .pipe(minify({
            ext: {min: '.min.js'}
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distFolder));
}

module.exports.cleanDist = cleanDist;
module.exports.dist = gulp.series(this.cleanDist, dist);
module.exports.default = this.dist;
