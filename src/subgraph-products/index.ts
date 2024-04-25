import { SubgraphModel } from "../core/models/subgraph.model";
import { productResolvers } from "./resolvers";
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { ProductDataSource } from "./datasources/datasource";

export const subgraphProducts: SubgraphModel = {
  name: 'products',
  resolvers: productResolvers,
  schema: gql(readFileSync('./src/subgraph-products/schema.graphql', 'utf-8')),
  type: "local",
  url: 'http://product',
  context({ cache }) {
    return {
      datasources: {
       product: new ProductDataSource(cache)
      }
    }
  },
}
