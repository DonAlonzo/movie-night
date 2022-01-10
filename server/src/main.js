import express from "express";
import bearerToken from "express-bearer-token";
import cors from "cors";
import { MongoClient } from "mongodb";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import initSchema from "./schema";

const main = async config => {
  const mongo = (await MongoClient.connect(`mongodb://${config.mongo.username}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}`, {
    useUnifiedTopology: true
  })).db("movie-night");

  const app = express();
  app.use(cors());
  app.use(bearerToken());

  const context = ({ req }) => {
    if (!req.token) {
      throw new AuthenticationError("Missing token.")
    }
    try {
      return jwt.verify(req.token, config.authenticationSecret);
    } catch (e) {
      throw new AuthenticationError("Bad token.");
    }
  };

  const { typeDefs, resolvers } = initSchema({ ...config, mongo });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
  await server.start();
  server.applyMiddleware({ app, path: "/api" });
  app.listen(80, () => console.log(`🚀 Server listening on 80`));
};

main({
  port: process.env.PORT || 8080,
  mongo: {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    port: 27017,
  },
  authenticationSecret: process.env.AUTHENTICATION_SECRET
}).catch(console.error);
