import { AIService, IAIService } from "src/server/service";
import { Disposable } from "src/base/common/dispose";
import { Browser, IBrowser } from "src/server/web";

const server = new class extends class Server extends Disposable {

    // [constructor]

    constructor() {
        super();
        this.__registerListeners();
    }

    // [public methods]

    public async run(): Promise<void> {
        const openai = await this.initOpenai();
        const browser = await this.initBrowser();
    }

    public exit(): void {
        this.dispose();
    }

    // [private helper methods]

    private async initOpenai(): Promise<IAIService> {
        const openai = new AIService({
            configurationPath: 'server.config.json',
        });
        
        await openai.init();
        return openai;
    }

    private async initBrowser(): Promise<IBrowser> {
        const browser = new Browser({
            port: 3000,
        });

        await browser.init();
        return browser;
    }

    private __registerListeners(): void {
        // TODO: exit listeners
    }
} 
{};

/**
 * hello there, my friend❤
 */
server.run();