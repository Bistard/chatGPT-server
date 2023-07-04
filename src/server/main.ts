
import { OpenAIApi } from "openai";
import { OpenaiConfigurationProvider } from "src/server/openai/configuration";

(async function main(): Promise<void> {
    const configurationProvider = new OpenaiConfigurationProvider('server.config.json');
    const configuration = await configurationProvider.build();
    
    const openai = new OpenAIApi(configuration);
    const chat_completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello world" }],
    });

    console.log(chat_completion.data.choices[0]!); // REVIEW
})();
