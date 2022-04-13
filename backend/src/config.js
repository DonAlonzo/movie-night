export default {
  authenticationPublicKey: process.env.AUTHENTICATION_PUBLIC_KEY || "🔓",
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    database: process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  }
};