import { merge } from "lodash";

import report from "./report";
import user from "./user";

const definitions = [
  report,
  user
];

const initSchema = args => definitions.map(init => init(args))
  .reduce((acc, { typeDef, resolvers }) => ({
    typeDefs: typeDef ? acc.typeDefs.concat(typeDef) : acc.typeDefs,
    resolvers: resolvers ? merge(acc.resolvers, resolvers) : acc.resolvers
  }), {
    typeDefs: [],
    resolvers: {},
  });

export default initSchema;
