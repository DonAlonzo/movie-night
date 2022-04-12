import { MongoClient } from "mongodb";

export const connectToDatabase = async ({ mongo: { host }}) => {
  const url = `mongodb://${host}`;
  while (true) {
    try {
      const mongoClient = await MongoClient.connect(url, {
        useUnifiedTopology: true
      });
      return mongoClient.db("movie-night");
    } catch (e) {
      console.error(`Failed to connect to ${url}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};