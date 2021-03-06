const merge2 = require("merge2");

module.exports = (gulp, g, config, paths, debug, typingsStream) => {

    gulp.task("protractor", function protractor() { // eslint-disable-line perf-standard/check-function-inline
        var sourceRoot = "src/app";
        var sourceStream = merge2(
            typingsStream().load(),
            gulp.src(paths.srcApp("**/*.e2e-spec.ts"), { since: gulp.lastRun("protractor") })
        );
        return sourceStream
            .pipe(debug("Test file", "protractor"))
            .pipe(g.if(config.isDev, g.sourcemaps.init()))
            .pipe(g.typescript(config.tsProject)).js
            .pipe(g.if(config.isDev, g.sourcemaps.write({ sourceRoot: sourceRoot })))
            .pipe(gulp.dest(paths.destJs))
            .pipe(g.protractor.protractor({ configFile: "protractor.conf.js" }));
    });

};
