import { CodegenConfig } from '@graphql-codegen/cli';

const codegen: CodegenConfig = {
  schema: './src/subgraph-offers/schema.graphql',
  generates: {
    './src/subgraph-offers/__generated-types.ts': {
      config: {
        federation: true,
        useIndexSignature: true,
        contextType: "./context#OffersContextModel",
        mappers: {
          Offer: './models#OfferModel',
          OfexSection: './models#OfexSectionModel'
        }
      },
      plugins: [
        'typescript',
        'typescript-resolvers'
      ]
    }
  }
}

export default codegen;