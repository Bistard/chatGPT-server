import * as path from 'path';
import * as fs from 'fs';
import { Configuration as OpenaiConfiguration } from "openai";

export interface IRawOpenaiConfiguration {
    readonly OPENAI_API_KEY: string;
}

export class OpenaiConfigurationProvider {

    // [fields]

    private readonly _path: string;

    // [constructor]

    constructor(path: string) {
        this._path = path;
    }

    // [public methods]

    public async build(): Promise<OpenaiConfiguration> {
    
        const configuration = await this.__readConfiguration(this._path);
        console.log(configuration); // REVIEW
    
        return new OpenaiConfiguration({
            apiKey: configuration.OPENAI_API_KEY,
        });
    }

    // [private methods]

    private async __readConfiguration(path: string): Promise<IRawOpenaiConfiguration> {
        let configuration: IRawOpenaiConfiguration;
        
        try {
            const raw = (await fs.promises.readFile(this._path)).toString();
            configuration = JSON.parse(raw);
        } catch (err) {
            throw err;
        }

        return configuration;
    }
}