import { BskyAgent, RichText } from '@atproto/api';
import dotenv from 'dotenv';
import axios from 'axios';

// Initialize dotenv to load environment variables
dotenv.config();

// Load credentials from .env
const { BSKY_USERNAME, BSKY_PASSWORD } = process.env;

// Initialize BlueSky agent
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

// The image URL
const imageUrl = "https://cdn.discordapp.com/attachments/734947299993714749/1307165413976838174/IMG_4135.jpg?ex=67395028&is=6737fea8&hm=61ba7ba20e009dd6b33a6f790355bffe42f5a1fc92f4cfe7fe71437eec9930e3&";

// Function to upload image and get blob reference
async function uploadImage() {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        const { data } = await agent.uploadBlob(imageBuffer, { encoding: 'image/jpeg' });
        return data.blob;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Post random message logic
async function postRandomMessage() {
    try {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        if (randomMessage === "gay lions attack") {
            // Upload the image and create post with image
            const imageBlobRef = await uploadImage();
            const rt = new RichText({ text: randomMessage });
            await rt.detectFacets(agent);

            await agent.api.app.bsky.feed.post.create(
                { repo: agent.session.did },
                {
                    $type: 'app.bsky.feed.post',
                    text: rt.text,
                    facets: rt.facets,
                    embed: {
                        $type: 'app.bsky.embed.images',
                        images: [{
                            alt: 'Posted image',
                            image: imageBlobRef,
                        }],
                    },
                    langs: ['en-US'],
                    createdAt: new Date().toISOString(),
                }
            );
            console.log("Posted message with image:", randomMessage);
        } else {
            // Post normal text message
            await agent.api.app.bsky.feed.post.create(
                { repo: agent.session.did },
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

// Start bot and schedule posts
async function startBot() {
    try {
        // Log in to the agent
        await agent.login({ identifier: BSKY_USERNAME, password: BSKY_PASSWORD });
        console.log('Bot logged in successfully!');

        // Post immediately on startup
        await postRandomMessage();

        // Schedule to post every 30 seconds (30000 ms) instead of 1 second
        // This is to avoid rate limiting issues
        setInterval(postRandomMessage, 1);
    } catch (error) {
        console.error('Error starting the bot:', error);
    }
}

startBot();