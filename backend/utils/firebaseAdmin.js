import { configDotenv } from "dotenv";
import admin from "firebase-admin";
configDotenv();

const serviceAccount = await JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
