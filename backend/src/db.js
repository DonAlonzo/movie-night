import { MongoClient, ObjectId } from "mongodb";

export const connectToDatabase = async ({ mongo: { host, port, database, username, password }}) => {
  const url = `mongodb://${typeof username !== 'undefined' && typeof password !== 'undefined' ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : ``}${host}:${port}/${database}`;
  while (true) {
    try {
      const mongoClient = await MongoClient.connect(url, {
        useUnifiedTopology: true
      });
      const db = mongoClient.db("movie-night");
      const movies = db.collection("movies");
      const watchings = db.collection("watchings");

      return {
        listWatchings: () => watchings.find({}).toArray(),
        insertWatching: async watching => {
          const { insertedId } = await watchings.insertOne(watching)
          return await watchings.findOne(insertedId);
        },
        findMovieById: id => movies.findOne(ObjectId(id)),
        insertMovie: async movie => {
          const { insertedId } = await movies.insertOne(movie);
          return await movies.findOne(insertedId);
        }
      };
    } catch (e) {
      console.error(`Failed to connect to database (${e.message}). Retrying...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};