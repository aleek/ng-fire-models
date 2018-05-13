process.env.CHROME_BIN = require('puppeteer').executablePath()
module.exports = function (config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "base.spec.ts" },
            { pattern: "src/*.+(ts|html)" },
            { pattern: "assets/*.png", watched: false, included: false, served: true, nocache: false}
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            bundlerOptions: {
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require("karma-typescript-angular2-transform")
                ],
                exclude: [
                    "@firebase/app-types",
                    "@firebase/firestore-types"
                ],
                sourceMap: true,
            },
            compilerOptions: {
                lib: ["ES2015", "DOM"],
                sourceMap: true,
            },
            coverageOptions: {
                instrumentation: true
            }
        },
        //logLevel: config.LOG_DEBUG,
        singleRun: true,

        reporters: ['mocha'],

        browsers: ["ChromeHeadless"],
        customLaunchers: {
            ChromeHeadlessTravis: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        captureTimeout: 210000,
        browserDisconnectTolerance: 3, 
        browserDisconnectTimeout : 210000,
        browserNoActivityTimeout : 210000,

    });
};
