const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');
const minify = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');

let tsProject = ts.createProject('tsconfig.json');

const publicFolder = 'public';

function cleanPublic() {
    return gulp.src(publicFolder, {allowEmpty: true})
        .pipe(clean());
}

function buildTypescript() {
    return tsProject.src()
        .pipe(gulp.dest(publicFolder + "/js"))
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(minify({
            ext: {min: '.min.js'}
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(publicFolder + "/js"));
}

function copyResources() {
    return gulp.src('./res/**/*')
        .pipe(gulp.dest(publicFolder));
}

module.exports.cleanPublic = cleanPublic;
module.exports.buildTypescript = buildTypescript;
module.exports.copyResources = copyResources;
module.exports.default = gulp.series(this.cleanPublic, gulp.parallel(this.copyResources, this.buildTypescript));
