# Honeypot: Gift Card Verification

This is a security prototype for identifying and logging IP addresses of visitors who submit form data.

## How to use:

1.  Open the directory: `cd itunes-honeypot`
2.  Install dependencies: `npm install`
3.  Start the server: `npm start`
4.  The server will be running on `http://localhost:3000`.

## Features:

- Logs visitor's IP address.
- Logs submitted "card code" and "phone number".
- Saves logs to `logs.txt` and prints them to the console.

## Important Note:

When running locally, your IP will likely be `::1` (localhost).
To test this in a "real-world" scenario, you would deploy this to a public server (like Vercel, Render, or a VPS) and use a tool like Cloudflare to sit in front of it.

### Legal and Privacy Notice:

Collecting IP addresses and user data should only be done for legitimate security research. Ensure you are following all applicable laws and regulations.
