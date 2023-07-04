import { Disposable } from "src/base/common/dispose";
import { OpenAIApi } from "openai";
import { OpenaiConfigurationProvider } from "src/server/openai/configuration";

/**
 * An interface only for {@link Openai}.
 */
export interface IOpenai extends Disposable {
    
    /**
     * Access to the raw openai API.
     */
    readonly api: OpenAIApi;

    /**
     * Initialize the openai service.
     */
    init(): Promise<void>;
}

/**
 * Construction options for {@link openai}.
 */
export interface OpenaiOptions  {
    readonly configurationPath: string;
}

/**
 * // TODO
 */
export class Openai extends Disposable implements IOpenai {
    
    // [fields]

    private _initialized: boolean;
    private readonly _configuration: OpenaiConfigurationProvider;
    private _api?: OpenAIApi;

    // [constructor]

    constructor(options: OpenaiOptions) {
        super();
        this._initialized = false;
        this._configuration = new OpenaiConfigurationProvider(options.configurationPath);
    }

    // [getter]

    get api(): OpenAIApi {
        if (!this._initialized || !this._api) {
            throw new Error('[Openai] not intialized.');
        }
        return this._api;
    }

    // [public methods]

    public async init(): Promise<void> {
        if (this._initialized) {
            throw new Error('[Openai] cannot be initialized twice.');
        }
        this._initialized = true;

        const configuration = await this._configuration.build();
        this._api = new OpenAIApi(configuration);
    }

    // [private methods]

}