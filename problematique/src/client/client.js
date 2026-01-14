const https = require('https');
const fs = require('fs');

// Configurating the HTTPS request that will be sent to the server
const options = {
    hostname: 'serveur-app.gei761.com', // DNS should resolve this
    port: 443, // I'm being explicit here
    path: '/',
    method: 'GET',
    key: fs.readFileSync('/app/cert/client.key'),
    cert: fs.readFileSync('/app/cert/client.crt'),
    ca: fs.readFileSync('/app/cert/ca.crt'),
};

//Building the request
console.log(`Sending HTTPS request to server`)
const req = https.request(options, res => {

    console.log(`Response received. Status code : ${res.statusCode}`);
    res.on('data', data => {
        process.stdout.write(data);
    });
});

req.on('error', error => {
    console.error(`ERROR : ${error.message}`);
});

req.end();