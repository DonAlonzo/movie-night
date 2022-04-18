import { MongoClient } from "mongodb";

export const connectToDatabase = async ({ mongo: { host, port, database, username, password }}) => {
  const url = `mongodb://${username && password ? `${username}:${password}@` : ``}${host}:${port}/${database}`;
  while (true) {
    try {
      const mongoClient = await MongoClient.connect(url, {
        useUnifiedTopology: true
      });
      const db = mongoClient.db("movie-night");
      return {
        
      };
    } catch (e) {
      console.error(`Failed to connect to ${url}. Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};