import * as graphqlHTTP from "koa-graphql";
import { GraphQLError } from "graphql";
import * as Router from "koa-router";

import CONFIG from "../config";
import GraphQLSchema from "../graphql";

const isProduction: boolean = CONFIG.isProduction;

function errorFormattor(err: GraphQLError): GraphQLError {
  return err;
}

interface ExtensionsArgv$ {
  startTime: number;
}

interface ExtensionsRes$ {
  runTime?: number;
  variables?: any;
  operationName?: string;
}

function extensions(
  { document, variables, operationName, result }: any,
  argv: ExtensionsArgv$
): ExtensionsRes$ {
  const startTime = argv.startTime;
  if (!isProduction) {
    return {
      runTime: Date.now() - startTime,
      variables,
      operationName
    };
  } else {
    return {};
  }
}

export default () => {
  const router = new Router();

  router.all(
    "/",
    graphqlHTTP((ctx: any) => {
      return {
        schema: GraphQLSchema,
        graphiql: !isProduction,
        formatError: errorFormattor
      };
    })
  );

  return router;
};
