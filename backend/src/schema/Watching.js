export default db => ({
  typeDef: `
    type Query {
      watchings: [Movie]
    }

    type Watching {
      _id: ID
      title: String
      movie: Movie
    }

    type Mutation {
      createWatching(movie: ID!): Watching
    }
  `,
  resolvers: {
    Query: {
      watchings: () => db.listWatchings()
    },
    Watching: {
      movie: (_, { movie }, __) => db.findMovieById(movie)
    },
    Mutation: {
      createWatching: (_, { movie }, __) => db.insertWatching({
        movie
      })
    }
  }
});