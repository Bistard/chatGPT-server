import { Disposable } from "src/base/common/dispose";
import express from 'express';

/**
 * An interface for {@link Browser}.
 */
export interface IBrowser extends Disposable {

    init(): Promise<void>;
}

/**
 * Options for {@link Browser} construction.
 */
export interface IBrowserOptions {
    
    /**
     * The port number.
     */
    readonly port: number;
}

export class Browser extends Disposable implements IBrowser {

    // [fields]

    private readonly _opts: IBrowserOptions;

    // [constructor]

    constructor(options: IBrowserOptions) {
        super();
        this._opts = options;
    }

    // [public methods]

    public async init(): Promise<void> {
        const app = express();
        const port = this._opts.port;

        app.get('/', (req, res) => {
        res.send('Hello World!')
        });

        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`)
        });
    }
}