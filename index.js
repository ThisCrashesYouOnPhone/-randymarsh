const { BskyAgent } = require('@atproto/api');
require('dotenv').config();

// Load credentials from .env
const username = process.env.BSKY_USERNAME;
const password = process.env.BSKY_PASSWORD;

// Initialize the agent
const agent = new BskyAgent({ service: 'https://bsky.social' });

// List of messages for the bot to randomly choose from
const messages = [
    "noah u the goat.",
    "alec u the goat",
    "noah u the bum✨",
    "alec u the bum🤖",
    "ryan u the goat 🌈",
    "ryan u the bum 💪",
    "I like what's on the desserts page",
    "Epic doggy be sitting",
    "glozy",
    "goofy ahh fuckass ahh 😌",
    "the walmart product of the penis",
    "ghunt",
    "sploosh",
    "beef 🫡🙌",
];

async function postRandomMessage() {
    try {
        // Select a random message from the list
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Post the message
        const response = await agent.api.app.bsky.feed.post.create(
            { repo: agent.session.did }, // The bot's DID
            {
                $type: 'app.bsky.feed.post',
                text: randomMessage,
                createdAt: new Date().toISOString(),
            }
        );

        console.log('Posted message:', randomMessage);
    } catch (error) {
        console.error('Error posting message:', error);
    }
}

async function startBot() {
    try {
        // Log in
        await agent.login({ identifier: username, password });
        console.log('Bot logged in successfully!');

        // Post immediately on startup
        await postRandomMessage();

        // Schedule to post every 2 hours (2 hours = 2 * 60 * 60 * 1000 ms)
        setInterval(postRandomMessage, 15 * 1000);
    } catch (error) {
        console.error('Error starting the bot:', error);
    }
}

startBot();
