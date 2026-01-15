#!/usr/bin/env node
/**
 * Helper script to generate hashed passwords for users.json
 * Usage: node generate_password.js <password>
 */

const crypto = require('crypto');

function generatePasswordHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256').toString('hex');
    
    return { salt, hash };
}

const password = process.argv[2];

if (!password) {
    console.log('Usage: node generate_password.js <password>');
    console.log('\nExample: node generate_password.js mySecurePassword123');
    process.exit(1);
}

const result = generatePasswordHash(password);

console.log('\nGenerated password hash:');
console.log(JSON.stringify(result, null, 2));
console.log('\nAdd this to users.json like:');
console.log(`"username": ${JSON.stringify(result, null, 2)}`);
