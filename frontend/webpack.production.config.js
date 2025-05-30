const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "production",

    entry: "./src/app.ts",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js",
      },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/acfrontend/dist/acfrontend.js' },
                { from: 'node_modules/acts-util-core/dist/acts-util-core.js' },
                { from: 'static' }
            ]
        }),
    ],

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "acfrontend": "window",
        "acts-util-core": "window",
    }
};