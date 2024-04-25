import { SubgraphModel } from "../core/models/subgraph.model";
import { offersResolvers } from "./resolvers";
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { OffersDataSource } from "./datasources/offers.datasource";

export const subgraphOffers: SubgraphModel = {
  name: 'offers',
  resolvers: offersResolvers,
  schema: gql(readFileSync('./src/subgraph-offers/schema.graphql', 'utf-8')),
  type: 'local',
  url: 'http://offers',
  context({ cache }) {
    return {
      datasources: {
       offers: new OffersDataSource(cache)
      }
    }
  },
}
