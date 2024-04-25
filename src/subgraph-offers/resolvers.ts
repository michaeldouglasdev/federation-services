import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { Resolvers } from './__generated-types';
import { ListOfexSections } from './services/list-ofex-sections.service';

export const offersSchema = gql(readFileSync('./src/subgraph-offers/schema.graphql', "utf-8"));

export const offersResolvers: Resolvers = {
  Query: {
    ofexSections: async (_parent, _args, context, _info) => {
      const listOfexSections = new ListOfexSections(context.datasources.offers)
      return listOfexSections.execute();
    },
  },
  Offer: {
    description: () => {
      return 'Essa é uma descrição'
    },
    __resolveReference: (arg: any) => {
      return {
        id: 'offer-1',
        name: 'oferta boa',
        description: 'Descrição boa'
      }
    }
  },
}
