import { ObjectId } from "mongodb";
import { gql, ForbiddenError, UserInputError } from "apollo-server-express";

export default ({ mongo }) => ({
  typeDef: gql`
    type Query {
      review(_id: ID!): Review
    }

    type Review {
      _id: ID
    }
  `,

  resolvers: {
    Query: {
      review: async (_, { _id }, { userId }) => {
        const review = await mongo
          .collection("review")
          .findOne(ObjectId(_id));

        if (review === null) throw new UserInputError("Review does not exist.");

        return {
          id: review._id
        };
      }
    }
  }
});
