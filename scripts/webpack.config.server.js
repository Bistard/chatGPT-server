const path = require('path');
const WebpackBaseConfigurationProvider = require("./webpack.config.base");

/**
 * @description The general webpack configuration of the application compilation.
 */
class WebpackConfigurationProvider extends WebpackBaseConfigurationProvider {

    #distPath = './dist';
    
    /** @type {string} Current working directory */
    #cwd;

    /** @type {string} environment mode */
    #envMode;
    #isWatchMode;

    constructor(cwd) {
        super();
        this.#cwd = cwd;

        // init environment constant
        this.#envMode = process.env.NODE_ENV ?? 'development';
        this.#isWatchMode = (process.env.WATCH_MODE == 'true');
    }

    // [public - configuration initialization]

    consturct() {

        // base configuration
        const baseConfiguration = Object.assign(
            {},
            super.construct({
                mode: this.#envMode,
                cwd: this.#cwd,
                watchMode: this.#isWatchMode,
                plugins: undefined,
            }),
        );
        
        // compiles SCSS files to CSS files
        baseConfiguration.module.rules.push({
            test: /\.(css)$/,
            use: ['css-loader'],
        });

        return [
            this.#construct(Object.assign({}, baseConfiguration)),
        ];
    }

    // [private - configuration construction]

    #construct(baseConfiguration) {
        const mainConfiguration = 
            Object.assign(
                baseConfiguration, 
                {
                    target: 'node',
                    entry: {
                        main: './src/server/main.ts',
                    },
                    output: {
                        filename: '[name]-bundle.js',
                        path: path.resolve(this.#cwd, this.#distPath)
                    },
                },
            );
        return mainConfiguration;
    }
}

// entries
const provider = new WebpackConfigurationProvider(process.cwd());
module.exports = provider.consturct();