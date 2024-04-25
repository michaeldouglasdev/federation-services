import { buildSubgraphSchema } from '@apollo/subgraph';
//import { loadFilesSync } from '@graphql-tools/load-files';
import { DocumentNode, GraphQLDeferDirective, GraphQLSchema, specifiedDirectives } from 'graphql';
import { authenticatedDirective } from '../directives/authenticated.directive';
import { capitalizeAllDirective } from '../directives/capitalize-all.directive';
import { capitalizeDirective } from '../directives/capitalize.directive';
import { dateDirective } from '../directives/date.directive';
import lengthDirective from '../directives/length';

import { lowerDirective } from '../directives/lower.directive';
import { removeDirective } from '../directives/remove.directive';
import { upperDirective } from '../directives/upper.directive';
import { validateDirective } from '../directives/validate.directive';

/*import {
  GraphQLDeferDirective,
GraphQLStreamDirective,
specifiedDirectives,
} from 'graphql';*/

import { astFromDirective, printSchemaWithDirectives } from "@graphql-tools/utils";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { QueryResolvers } from '../subgraph-products/__generated-types';
//const deferDirectiveAST = astFromDirective(GraphQLDeferDirective)
//const streamDirectiveAST = astFromDirective(GraphQLStreamDirective)

export function applyDirectives (graphQLSchema: DocumentNode, resolvers: any) {

  /* const directives = loadFilesSync(`src/directives`);*/

  const { authenticatedDirectiveTransformer } = authenticatedDirective()
  const { upperDirectiveTransformer} = upperDirective();
  const { lowerDirectiveTransformer } = lowerDirective();
  const { capitalizeDirectiveTransformer } = capitalizeDirective();
  const { capitalizeAllDirectiveTransformer } = capitalizeAllDirective();
  const { dateDirectiveTransformer } = dateDirective();
  const { lengthDirectiveTransformer } = lengthDirective();
  const { validateDirectiveTransformer } = validateDirective()
  const { removeDirectiveTransformer } = removeDirective();

  const directiveTransformers = [
    authenticatedDirectiveTransformer,
    upperDirectiveTransformer,
    lowerDirectiveTransformer,
    capitalizeDirectiveTransformer,
    capitalizeAllDirectiveTransformer,
    dateDirectiveTransformer,
    lengthDirectiveTransformer,
    validateDirectiveTransformer,
    removeDirectiveTransformer,
  ];

  const transformedSchema = directiveTransformers.reduce((schema, transformer) =>
    transformer(schema), buildSubgraphSchema({
      typeDefs: graphQLSchema,
      resolvers,

    })
  )
  const schema = transformedSchema;

  /*const transformedSchema2 = new GraphQLSchema({
    ...schema.toConfig(),
    directives: [...schema.getDirectives(), ...specifiedDirectives, GraphQLDeferDirective]
  })*/
  return transformedSchema;
}
