const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:'zainfinal-b9de0.appspot.com'
});

const bucket = admin.storage().bucket('zainfinal-b9de0.appspot.com');

module.exports = bucket