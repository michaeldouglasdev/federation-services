import dotenv from 'dotenv';
dotenv.config();

import { SubgraphContainer } from "./src/core/models/subgraph-container";
import { subgraphOffers } from "./src/subgraph-offers";
import { subgraphProducts } from "./src/subgraph-products";

async function routerBootstrap() {
  SubgraphContainer.set(subgraphProducts.name, subgraphProducts);
  SubgraphContainer.set(subgraphOffers.name, subgraphOffers);

  SubgraphContainer.applyDirectives();
  SubgraphContainer.generateTransformedSchema();

  await SubgraphContainer.startSubgraphServer();
  //SubgraphContainer.generateSupergraph();
  //SubgraphContainer.startRouter();
  //execSync('./router --supergraph supergraph.graphql --dev')
}

routerBootstrap();