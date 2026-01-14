const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('/app/cert/server.key'),
    cert: fs.readFileSync('/app/cert/server.crt'),
    ca: fs.readFileSync('/app/cert/ca.crt'),
    requestCert: true,
    rejectUnauthorized: true
};

const server = https.createServer(options, (req, res) => {
    const cert = req.socket.getPeerCertificate();

    // Vérification de sécurité si l'objet cert est vide
    if (!cert || !cert.subject) {
        res.writeHead(401);
        return res.end("ERROR: Client certificate required\n");
    }

    const clientName = cert.subject.CN;
    console.log(`Received HTTPS packets from : ${clientName}`);

    // Correction de la structure IF/ELSE
    if (clientName === "gei761") {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("mTLS success\n");
    } else {
        res.writeHead(403);
        res.end(`ERROR: Common Name "${clientName}" is not recognized\n`);
    }
});

server.listen(443, '0.0.0.0', () => {
    console.log("Server listening on port 443 (mTLS active)");
});