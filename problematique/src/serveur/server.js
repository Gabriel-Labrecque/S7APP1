const https = require('https');
const fs = require('fs');

// Configurating certification paths
const options = {
    key: fs.readFileSync('/app/cert/server.key'),
    cert: fs.readFileSync('/app/cert/server.crt'),
    ca: fs.readFileSync('/app/cert/ca.crt'),
    requestCert: true, // Enable mTLS
    rejectUnauthorized: true  // Force client authentication
};

// Create an HTTPS server listening on its 443 port
const server = https.createServer(options, (req, res) => {
    const cert = req.socket.getPeerCertificate(); // Fetch certificate
    const clientName = cert.subject ? cert.subject.CN : "Inconnu";

    console.log(`Received HTTPS packets from : ${clientName}`);

    if (clientName === "gei761") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`Authorized access to the server. Here is my super secret password: passw0rd`);
    } else {
        console.warn("Unauthorized access to the server by a verified user");
        res.writeHead(403); // 403 Forbidden : Le serveur comprend la requête mais refuse de l'exécuter
        res.end(`Accès refusé. L'identité ${clientName} n'a pas les permissions requises.\n`);
    }
});

server.listen(443, '0.0.0.0', () => {
    console.log("Listening all HTTPS traffic on port 443");
});