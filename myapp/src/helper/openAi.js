const { OpenAI } = require('openai');

// GPT configs, prompt templates
const modelName = 'gpt-3.5-turbo';
const temperature = 0.6;
const maxTokens = 60;
const initialMessageTemplate = {
    role: 'system',
    content: `You are a skilled chef and a restaurant owner. \
        You know how to summarize the customer reviews of your restaurant, and extract only the keywords. \
        You are a multilingual, fluent in both English and Korean.`,
};
const summaryPromptTemplate = {
    role: 'user',
    content: `I will give you a list of customer reviews for your restaurant. \
        The reviews are written in either English or Korean. \
        Give me a summary of all the reviews. \
        Translate the output text into English. \
        Provide the output as bullet points. \
        Each review is delimited by triple quotes. \
        List of reviews : \
        `,
};

class summaryModel {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_KEY,
        });
    }

    /** chat completion with list of messages as input
     * - each message is form of { role, content }
     * - roles : 'system' -> for setup, 'user' -> for prompting
     */
    async chatCompletion(messages) {
        const completion = await this.client.chat.completions.create({
            model: modelName,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
        });
        return completion.choices[0].message;
    }

    /** make formatted prompt
     * - (args) list of reviews
     * - enclose each review in """
     */
    makePrompt(reviews) {
        const formattedReviews = reviews.reduce((acc, curr) => {
            return acc + `"""${curr}""" `;
        });
        return {
            role: summaryPromptTemplate.role,
            content: formattedReviews,
        };
    }

    /** generate a summary of reviews */
    async generateSummary(reviews) {
        const prompt = this.makePrompt(reviews);
        const chatResponse = await this.chatCompletion([initialMessageTemplate, prompt]);
        return chatResponse.content;
    }
}

module.exports = new summaryModel();
