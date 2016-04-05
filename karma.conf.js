var config = require("./gulpfile.conf");

function karmaFiles() {
    var jsLibs = config.test.jsLibs.map(lib => ({pattern: lib, watched: false, included: true}));
    var files = [
        // Paths loaded via module imports.
        {pattern: "build/js/**/*.js", included: false, watched: true},
        "karma.shim.js"
    ];
    return [...jsLibs, ...files];
}

module.exports = function(karma) {
    karma.set({
        files: karmaFiles(),
        browsers: ["PhantomJS"],
        plugins: [
            "karma-jasmine",
            "karma-coverage",
            "karma-phantomjs-launcher",
            "karma-sourcemap-loader",
        ],
        frameworks: [
            "jasmine",
        ],
        preprocessors: {
            // Source files, that you want to generate coverage for, do not include tests or libraries.
            "build/js/**/!(*.spec|*.test|*.e2e).js": ["coverage"],
            "build/js/**/*.js": ["sourcemap"]
        },
        reporters: ["progress", "coverage"],
        coverageReporter: {
            dir: ".coverage",
            reporters: [
                { type: "json", file: "coverage.json" },
                { type: "lcov", file: "coverage.lcov" },
            ]
        },
        // proxied base paths
        // proxies: {
        //     // required for component assests fetched by Angular's compiler
        //     "/src/": "/base/src/"
        // },
        autoWatch: true,
        autoWatchBatchDelay: 200,
        singleRun: false,
        port: 9876,
        logLevel: karma.LOG_INFO
    });
};