const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

// Load user database from external file (protected with hashed passwords)
const users = JSON.parse(fs.readFileSync('/app/users.json', 'utf8'));

function verifyPassword(username, password) {
    const user = users[username];
    if (!user) return false;
    
    const hash = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha256').toString('hex');
    return hash === user.hash;
}

const options = {
    key: fs.readFileSync('/app/cert/server.key'),
    cert: fs.readFileSync('/app/cert/server.crt'),
    ca: fs.readFileSync('/app/cert/ca.crt'),
    requestCert: true,
    rejectUnauthorized: true
};

const server = https.createServer(options, (req, res) => {
    const cert = req.socket.getPeerCertificate();
    
    // Log TLS security info
    const cipher = req.socket.getCipher();
    console.log(`\n=== TLS Connection Info ===`);
    console.log(`Cipher: ${cipher.name}`);
    console.log(`Version: ${cipher.version}`);
    console.log(`Bits: ${cipher.standardName || 'N/A'}`);

    // Vérification de sécurité si l'objet cert est vide
    if (!cert || !cert.subject) {
        res.writeHead(401);
        return res.end("ERROR: Client certificate required\n");
    }

    const clientName = cert.subject.CN;
    console.log(`Client Certificate CN: ${clientName}`);

    // Step 1: Verify application certificate (mTLS)
    if (clientName !== "gei761") {
        res.writeHead(403);
        return res.end(`ERROR: Common Name "${clientName}" is not recognized\n`);
    }

    // Step 2: Verify user credentials
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
        try {
            const { username, password } = JSON.parse(body);
            
            if (verifyPassword(username, password)) {
                console.log(`✓ Application authenticated: ${clientName}`);
                console.log(`✓ User authenticated: ${username}`);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Success! Application: ${clientName}, User: ${username}\n`);
            } else {
                console.log(`✗ Invalid credentials for user: ${username}`);
                res.writeHead(401);
                res.end("Invalid username or password\n");
            }
        } catch (e) {
            res.writeHead(400);
            res.end("Invalid request format\n");
        }
    });
});

server.listen(443, '0.0.0.0', () => {
    console.log("Server listening on port 443");
    console.log("Dual authentication active:");
    console.log("  1. mTLS - Application authentication via certificates");
    console.log("  2. Password - User authentication via credentials");
    console.log("\nDemo users: newton/password123");
});