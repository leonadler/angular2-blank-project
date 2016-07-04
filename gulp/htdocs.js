module.exports = (gulp, g, config) => {

    gulp.task("htdocs", function htdocs() {
        var styles = gulp.src(["build/design/main.css", "build/design/*"], { read: false });
        var jsLibs = config.jsLibs;
        if (config.isProd) {
            jsLibs = "build/js/*.js";
        }
        var scripts = gulp.src(jsLibs, { read: false })
            .pipe(g.if(config.isProd, g.order(["polyfills.js", "vendors.js", "main.js", "*.js"])));
        return gulp.src("src/index.html")
            .pipe(g.inject(styles, { addRootSlash: false, ignorePath: "build" }))
            .pipe(g.inject(scripts, { addRootSlash: false, ignorePath: "build" }))
            .pipe(g.preprocess({ context: config }))
            .pipe(gulp.dest("build"))
            .pipe(g.connect.reload());
    });
};