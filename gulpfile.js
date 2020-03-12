const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');

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

const build = gulp.parallel(copyResources, buildTypescript);

function watchSources() {
    return gulp.watch(["src/", "res/"], build);
}

function watchPublic(cb) {
    gulp.watch(publicFolder).on("change", (filepath) => {
        return gulp.src(filepath, {read: false}).pipe(connect.reload());
    });
    cb();
}

function serve() {
    return connect.server({
        root: publicFolder,
        livereload: true
    });
}

module.exports = {
    cleanPublic: cleanPublic,
    buildTypescript: buildTypescript,
    copyResources: copyResources,
    serve: gulp.series(cleanPublic, build, gulp.parallel(serve, watchSources, watchPublic)),
    default: gulp.series(cleanPublic, build)
};
