// Usage: node scripts/hash-admin-password.js
// Prompts for a password (not echoed) and prints the value for the Vercel env var ADMIN_PASSWORD_HASH_B64.
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl._writeToOutput = (s) => { if (s.includes('Password')) process.stdout.write(s); };
rl.question('Password (min 12 characters): ', (password) => {
  rl.close();
  process.stdout.write('\n');
  if (!password || password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
  }
  const hash = bcrypt.hashSync(password, 12);
  console.log('ADMIN_PASSWORD_HASH_B64=' + Buffer.from(hash).toString('base64'));
});
