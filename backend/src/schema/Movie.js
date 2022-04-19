export default db => ({
  typeDef: `
    type Movie {
      _id: ID
      title: String
      imdb: String
    }

    type Mutation {
      createMovie(imdb: String): Movie
    }
  `,
  resolvers: {
    Movie: {
    },
    Mutation: {
      createMovie: (_, { input }, __) => db.insertMovie(input)
    }
  }
});