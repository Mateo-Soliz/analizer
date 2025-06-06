import { MongoClient } from 'mongodb';

// This lib is use just to connect to the database in next-auth.
// We don't use it anywhere else in the API routes—we use mongoose.js instead (to be able to use models)

declare global {
  // var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

if (!uri) {
  console.group('⚠️ MONGODB_URI missing from .env');
  console.error(
    "It's not mandatory but a database is required for Magic Links.",
  );
  console.error(
    "If you don't need it, remove the code from /libs/next-auth.js (see connectMongo())",
  );
  console.groupEnd();
} else if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
