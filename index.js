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
    "noah is the goatatron",
    "chungus media https://media.discordapp.net/attachments/494986636812353541/1240825487056568401/IMG_0430.jpg?ex=67393ac9&is=6737e949&hm=f9e971eb9f9456e6aa97830bb1f95ef3e140a8dba6664ceedc0b2f5b30534b07&",
    "gay lions attack",
];

async function postRandomMessage() {
    try {
        // Select a random message from the list
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // If the random message is the one for an image, we handle it differently
        if (randomMessage === "gay lions attack") {
            // Provide the image path and ensure it exists
            const imagePath = path.join(__dirname, 'images', 'IMG_4135.jpg');
            if (fs.existsSync(imagePath)) {
                console.log("Image found. Posting...");

                // Upload the image (manually upload it to your service or BlueSky and get the URL)
                const imageUrl = "https://cdn.discordapp.com/attachments/734947299993714749/1307165413976838174/IMG_4135.jpg?ex=67395028&is=6737fea8&hm=61ba7ba20e009dd6b33a6f790355bffe42f5a1fc92f4cfe7fe71437eec9930e3&"; // Replace this with your actual image URL

                // Post the image with the message
                await agent.api.app.bsky.feed.post.create(
                    { repo: agent.session.did }, // The bot's DID
                    {
                        $type: 'app.bsky.feed.post',
                        text: randomMessage + " " + imageUrl, // Combine the message with the image URL
                        createdAt: new Date().toISOString(),
                    }
                );
                console.log("Posted message with image:", randomMessage);
            } else {
                console.error("Image file not found.");
            }
        } else {
            // Normal text post
            await agent.api.app.bsky.feed.post.create(
                { repo: agent.session.did }, // The bot's DID
                {
                    $type: 'app.bsky.feed.post',
                    text: randomMessage,
                    createdAt: new Date().toISOString(),
                }
            );
            console.log('Posted message:', randomMessage);
        }
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
