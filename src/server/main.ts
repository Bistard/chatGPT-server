import { Openai } from "src/server/openai/openai";

const server = new class extends class Server {

    // [constructor]

    constructor() {}

    // [public methods]

    public async run(): Promise<void> {
        const openai = new Openai({
            configurationPath: 'server.config.json',
        });
        
        const chat_completion = await openai.api.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello world" }],
        });
    
        console.log(chat_completion.data.choices[0]!); // REVIEW
    }
} {};

/**
 * hello there, my friend❤
 */
server.run();