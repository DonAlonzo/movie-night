import { ObjectId } from "mongodb";
import { gql } from "apollo-server-express";

export default ({ mongo }) => ({
  typeDef: gql`
    type Query {
      person(id: ID!): Person
    }

    type Person {
      id: ID
      name: String
    }

    type Mutation {
      createPerson(name: String!): Person
    }
  `,

  resolvers: {
    Query: {
      person: async (_, { id }, { userId }) => {
        return {
          id,
          name: "fake"
        }
      }
    },
    Mutation: {
      createPerson: async (_, { name, file }, { userId }) => {
        // const { insertedId } = await mongo
        //   .collection("person")
        //   .insertOne({
        //     name
        //   });
        
        // return {
        //   id: insertedId.toHexString(),
        //   name
        // };
      }
    }
  }
});