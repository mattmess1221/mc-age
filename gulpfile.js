const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const webserver = require('gulp-webserver');

let tsProject = ts.createProject('tsconfig.json');

const publicFolder = 'public';

function cleanPublic() {
    return gulp.src(publicFolder, {allowEmpty: true})
        .pipe(clean());
}

function buildTypescript() {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(minify({
            ext: {min: '.min.js'}
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(publicFolder));
}

function copyResources() {
    return gulp.src(['./res/**/*'])
        .pipe(gulp.dest(publicFolder));
}

const defaultTask = gulp.series(cleanPublic, gulp.parallel(copyResources, buildTypescript));

function watch() {
    return gulp.watch(["src/", "res/"], defaultTask);
}

function serve() {
    return gulp.src(publicFolder)
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true
        }))
}

module.exports = {
    cleanPublic: cleanPublic,
    buildTypescript: buildTypescript,
    copyResources: copyResources,
    serve: gulp.series(defaultTask, gulp.parallel(watch, serve)),
    default: defaultTask
};
