import { BskyAgent, RichText } from '@atproto/api';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// Initialize BlueSky agent
const agent = new BskyAgent({ service: 'https://bsky.social' });

// Message and GIF mappings

const MESSAGE_IMAGE_MAP = {
    "why dont you remember my name? 🍷 🗿": "https://cdn.discordapp.com/attachments/1307178821698588753/1307184166596776037/umadbro.jpeg?ex=6739619f&is=6738101f&hm=afdb585e8a9b82a192cd0d46faf450efed894d5b7b71bf8120d134d23d700afe&",
    "gay lions attack": "https://cdn.discordapp.com/attachments/734947299993714749/1307165413976838174/IMG_4135.jpg?ex=67395028&is=6737fea8&hm=61ba7ba20e009dd6b33a6f790355bffe42f5a1fc92f4cfe7fe71437eec9930e3&",
    "chungus media": "https://media.discordapp.net/attachments/494986636812353541/1240825487056568401/IMG_0430.jpg?ex=67393ac9&is=6737e949&hm=f9e971eb9f9456e6aa97830bb1f95ef3e140a8dba6664ceedc0b2f5b30534b07&",
    "I got  🤫": "https://cdn.discordapp.com/attachments/1307178821698588753/1307181398364258304/IMG_2090.png?ex=67395f0b&is=67380d8b&hm=cabae14d8cf5f46776581a62d6d5ff305d5103fda12044a117b2641e5810b948&"
};

const messages = [
    "why dont you remember my name? 🍷 🗿",
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
    ...Object.keys(MESSAGE_IMAGE_MAP),
];

async function createPost(message, imageUrl = null) {
    try {
        const postData = {
            $type: 'app.bsky.feed.post',
            text: message,
            createdAt: new Date().toISOString()
        };

        // Check if message has a Tenor GIF mapping
if (imageUrl) {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const { data: { blob } } = await agent.uploadBlob(
                Buffer.from(response.data),
                { encoding: 'image/jpeg' }
            );
            const rt = new RichText({ text: message });
            await rt.detectFacets(agent);
            postData.facets = rt.facets;
            postData.embed = {
                $type: 'app.bsky.embed.images',
                images: [{ alt: 'Posted image', image: blob }]
            };
        }

        await agent.api.app.bsky.feed.post.create(
            { repo: agent.session.did },
            postData
        );
        console.log(`Posted message${imageUrl ? ' with image' : ''}: ${message}`);
    } catch (error) {
        console.error(`Error posting message "${message}":`, error.message);
    }
}

async function postRandomMessage() {
    const message = messages[Math.floor(Math.random() * messages.length)];
    await createPost(message, MESSAGE_IMAGE_MAP[message]);
}

async function startBot() {
    try {
        await agent.login({
            identifier: process.env.BSKY_USERNAME,
            password: process.env.BSKY_PASSWORD
        });
        console.log('Bot logged in successfully!');
        await postRandomMessage();
        setInterval(postRandomMessage, 1000);
    } catch (error) {
        console.error('Error starting bot:', error.message);
    }
}

startBot();