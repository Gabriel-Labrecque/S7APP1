const https = require('https');
const fs = require('fs');

// Configurating the HTTPS request with mTLS
const options = {
    hostname: 'serveur-app.gei761.com',
    port: 443,
    path: '/',
    method: 'POST',
    key: fs.readFileSync('/app/cert/client.key'),
    cert: fs.readFileSync('/app/cert/client.crt'),
    ca: fs.readFileSync('/app/cert/ca.crt'),
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log('=== Dual Authentication Demo ===\n');
console.log('Sending HTTPS request with:');
console.log('  1. Client certificate (Application authentication)');
console.log('  2. User credentials (User authentication)\n');

// Building the request
const req = https.request(options, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        console.log(`Server Response (${res.statusCode}):`);
        console.log(data);
        
        if (res.statusCode === 200) {
            console.log('✓ Both authentications successful!');
        }
    });
});

req.on('error', error => {
    console.error(`ERROR: ${error.message}`);
});

// Send user credentials
const credentials = JSON.stringify({
    username: 'newton',
    password: 'password123'
});

req.write(credentials);
req.end();