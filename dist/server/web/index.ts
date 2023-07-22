import express from 'express';
import { Disposable } from "src/base/common/dispose";

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

    /**
     * The path to the front-end static files.
     */
    readonly static: string;
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
        
        // binding to the html
        app.use(express.static(this._opts.static));

        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    }
}