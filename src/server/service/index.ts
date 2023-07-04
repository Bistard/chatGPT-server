import { Disposable } from "src/base/common/dispose";
import { OpenAIApi } from "openai";
import { OpenaiConfigurationProvider } from "src/server/service/configuration";

/**
 * An interface only for {@link AIService}.
 */
export interface IAIService extends Disposable {
    
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
 * Construction options for {@link AIService}.
 */
export interface AIServiceOptions  {
    readonly configurationPath: string;
}

/**
 * // TODO
 */
export class AIService extends Disposable implements IAIService {
    
    // [fields]

    private _initialized: boolean;
    private readonly _configuration: OpenaiConfigurationProvider;
    private _api?: OpenAIApi;

    // [constructor]

    constructor(options: AIServiceOptions) {
        super();
        this._initialized = false;
        this._configuration = new OpenaiConfigurationProvider(options.configurationPath);
    }

    // [getter]

    get api(): OpenAIApi {
        if (!this._initialized || !this._api) {
            throw new Error('[AIService] not intialized.');
        }
        return this._api;
    }

    // [public methods]

    public async init(): Promise<void> {
        if (this._initialized) {
            throw new Error('[AIService] cannot be initialized twice.');
        }
        this._initialized = true;

        const configuration = await this._configuration.build();
        this._api = new OpenAIApi(configuration);
    }

    // [private methods]

}