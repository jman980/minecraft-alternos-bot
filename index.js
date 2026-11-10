const express = require('express');
const mineflayer = require('mineflayer');
const fs = require('fs');

// --- Render Keep-Alive Web Server ---
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot web server is running perfectly!');
});

app.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});
// ------------------------------------

// Load server details from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Initialize the Minecraft Bot
function createBot() {
    const bot = mineflayer.createBot({
        host: config.ip,
        port: parseInt(config.port),
        username: config.name,
        version: false // Autodetects server version
    });

    bot.on('login', () => {
        console.log(`${config.name} has successfully logged into the server.`);
        if (config.loginmsg) {
            bot.chat(config.loginmsg);
        }
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        console.log(`[Chat] ${username}: ${message}`);
    });

    bot.on('disconnect', (reason) => {
        console.log(`Bot disconnected: ${reason}. Reconnecting in 10 seconds...`);
        setTimeout(createBot, 10000);
    });

    bot.on('error', (err) => {
        console.log(`Error encountered: ${err.message}`);
    });
}

createBot();
