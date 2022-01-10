import { ObjectId } from "mongodb";
import { gql, ForbiddenError, UserInputError } from "apollo-server-express";

export default ({ mongo }) => ({
  typeDef: gql`
    type Query {
      currentUser: User
    }

    type User {
      _id: ID
    }
  `,

  resolvers: {
    Query: {
      currentUser: async (_, __, { userId }) => {
        const user = await mongo
          .collection("users")
          .findOne(ObjectId(userId));

        if (user === null) throw new UserInputError("User does not exist.");

        return {
          id: user._id
        };
      }
    }
  }
});
