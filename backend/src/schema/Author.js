export default db => ({
  typeDef: `
    extend type Query {
      author(id: Int!): Author 
    }

    type Author {
      id: Int!
      firstName: String
      lastName: String
      books: [Book]
    }
  `,
  resolvers: {
    Query: {
      author: () => null
    },
    Author: {
      books: () => []
    }
  }
});