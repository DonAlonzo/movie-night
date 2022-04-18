export default db => ({
  typeDef: `
    extend type Query {
      book(id: Int!): Book 
    }

    type Book {
      title: String
      author: Author
    }
  `,
  resolvers: {
    Query: {
      book: () => null,
    },
    Book: {
      author: () => null
    }
  }
});