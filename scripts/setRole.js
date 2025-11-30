// scripts/setRole.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ ERROR: service-account.json not found at:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];
const role = process.argv[3];

if (!uid || !role) {
  console.error('❌ Usage: node scripts/setRole.js <UID> \"role\"');
  console.error('Example: node scripts/setRole.js abc123 \"admin\"');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role })
  .then(() => {
    console.log(`✅ Role '${role}' set for UID: ${uid}`);
    return admin.auth().getUser(uid);
  })
  .then(userRecord => {
    console.log('Custom Claims now:', userRecord.customClaims);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error setting role:', err);
    process.exit(1);
  });
