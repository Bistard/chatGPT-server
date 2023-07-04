const path = require('path');

class WebpackBasePluginProvider {
    
    getPlugins() {
        const plugins = [
            ...this.#getOptionalPlugins(),
        ];
        return plugins;
    }
    
    #getOptionalPlugins() {
        const plugins = [];
        return plugins;
    }
}

/**
 * @description A base configuration for the webpack compilation of the whole 
 * program.
 */
class WebpackBaseConfigurationProvider {

    /**
     * @typedef {{
     *      mode: 'development' | 'production' | 'none';
     *      cwd: string;
     *      watchMode?: boolean;
     *      plugins?: any[];
     * }} baseConfigurationOptions
     */

    /**
     * @description Consturcts the base configuration.
     * @param {baseConfigurationOptions} opts 
     */
    construct(opts) {
        const option = opts;
        const isDevMode = option.mode === 'development';


        const basePlugins = new WebpackBasePluginProvider();
        option.plugins = [
            ...basePlugins.getPlugins(), 
            ...(option.plugins ?? []),
        ];


        // The webpack base configuration
        const baseConfiguration = {
            
            /**
             * Tells webpack to use its built-in optimizations accordingly.
             *      'development' | 'production' | 'none'
             */
            mode: option.mode,

            /**
             * The base directory, an absolute path, for resolving entry points 
             * and loaders from the configuration.
             */
            context: option.cwd,

            // Node.js options whether to polyfill or mock certain Node.js globals.
            node: {
                // The dirname of the input file relative to the `context`.
                __dirname: true,
            },

            /**
             * These options determine how the different types of modules within a 
             * project will be treated.
             */
            module: {

                rules: [
                    // compile TypeScript files into JavaScript files
                    {
                        test: /\.tsx?$/,
                        use: 'ts-loader',
                    },
                    // allows Nnode.js module to be used in the browser environment
                    {
                        test: /.node$/,
                        loader: 'node-loader',
                    },
                ]
            },

            // These options change how modules are resolved
            resolve: {
                
                // Create aliases to import or require modules.
                alias: {
                    src: path.resolve(option.cwd, 'src/'),
                },
                
                extensions: ['.tsx', '.ts', '.js'],
            },

            /**
             * watch options
             */
            watch: option.watchMode,
            watchOptions: {
                poll: 1000,            // check for changes in milliseconds.
                aggregateTimeout: 500, // aggregates any changes during the period into one rebuild.
                ignored: /node_modules/,
            },

            /**
             * Source maps are used to display your original JavaScript while debugging, 
             * which is a lot easier to look at than minified production code.
             * 
             * See more choice here:
             * {@link https://webpack.js.org/configuration/devtool/}
             */
            devtool: isDevMode ? 'eval-source-map' : 'source-map',
            
            /**
             * The `stats` option lets you precisely control what bundle 
             * information gets displayed. This can be a nice middle ground if 
             * you don't want to use `quiet` or `noInfo` because you want some 
             * bundle information, but not all of it.
             * 
             * {@link https://webpack.js.org/configuration/stats/}
             */
            stats: 'normal',

            /**
             * Fail out on the first error instead of tolerating it. 
             * 
             * @note Avoid using `bail` option in watch mode, as it will force 
             * webpack to exit as soon as possible when an error is found.
             */
            bail: !option.watchMode,

            /**
             * webpack extensions
             */
            plugins: option.plugins ?? [],
        };

        return baseConfiguration;
    }
}

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