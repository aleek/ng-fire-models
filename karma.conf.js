process.env.CHROME_BIN = require('puppeteer').executablePath()
module.exports = function (config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "base.spec.ts" },
            { pattern: "src/*.+(ts|html)" }
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

        //reporters: ["dots", "karma-typescript"],
        reporters: ['mocha'],

        browsers: ["ChromeHeadless"]
        //browsers: ["Chrome"]

    });
};
