import { ApolloServer, AuthenticationError } from "apollo-server-express";
import bearerToken from "express-bearer-token";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { merge } from 'lodash';
import { connectToDatabase } from "./db";
import initWatching from './schema/Watching';
import initMovie from './schema/Movie';

export default async config => {
  const db = await connectToDatabase(config); 

  const app = express();
  app.use(cors({ credentials: true }));
  app.use(bearerToken());

  const types = [
    initWatching(db),
    initMovie(db)
  ];

  const server = new ApolloServer({
    typeDefs: types.map(type => type.typeDef),
    resolvers: merge(types.map(type => type.resolvers)),
    context: ({ req }) => {
      if (!req.token) {
        throw new AuthenticationError("Missing token.")
      }
      try {
        return jwt.verify(req.token, config.authenticationPublicKey, { algorithms: ["ES512"] });
      } catch (e) {
        throw new AuthenticationError("Bad token.");
      }
    }
  });
  
  await server.start();

  server.applyMiddleware({ app });
  app.use((err, _, res, __) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  app.listen(80, () => console.log(`🚀 Server listening on 80`));
};