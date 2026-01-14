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

    if (res.statusCode === 200) {
        res.on('data', data => {
            process.stdout.write(data);
        });
    } else {
        console.error(`Request failed. Status Code: ${res.statusCode}`);
        // Optional: consume response data to free up memory
        res.resume();
    }
});

req.on('error', error => {
    console.error(`ERROR : ${error.message}`);
});

req.end();