import "reflect-metadata";
import dotenv from 'dotenv';
dotenv.config();

import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ProductDataSource } from './src/subgraph-products/datasources/datasource';
import { ProductContextModel } from './src/subgraph-products/context';
import { subgraphProducts } from './src/subgraph-products';
import { subgraphOffers } from "./src/subgraph-offers";
import { SubgraphContainer } from "./src/core/models/subgraph-container";
import { buildGraphQLDataSource } from "./src/core/build-graphql-datasource";

type Context = ProductContextModel;

async function bootstrap() {

  SubgraphContainer.set(subgraphProducts.name, subgraphProducts);
  SubgraphContainer.set(subgraphOffers.name, subgraphOffers);

  SubgraphContainer.applyDirectives();
  SubgraphContainer.generateTransformedSchema();

  const gateway = new ApolloGateway({
    //supergraphSdl: readFileSync("./supergraph.graphql", "utf8"),
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: SubgraphContainer.list().map(({name, url}) => ({ name, url })),
    }),
    buildService: ({ name, url }) => {
      const subgraph = SubgraphContainer.get(name)
      const datasource = buildGraphQLDataSource(subgraph);

      return datasource;
    },
    __exposeQueryPlanExperimental: true,
    queryPlannerConfig: {
      incrementalDelivery: {
        enableDefer: true,
      }
    },
  })

  const server = new ApolloServer<Context>({
    gateway,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;

      return {
        datasources: {
          product: new ProductDataSource({ cache }),
        }
      }
    },
    listen: {
      port: 4010
    }
  });

  console.log(`GraphQL server started at ${url}`);
}

bootstrap();