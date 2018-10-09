var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build", ["tsc", "copy"], function() {

});

gulp.task("copy", function () {
    return gulp.src("./src/*.json")
        .pipe(gulp.dest("messages"));
});

gulp.task("tsc", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("messages"));
});

gulp.task("pack", function() {

});

