import { GraphQLDataSource, LocalGraphQLDataSource, RemoteGraphQLDataSource } from "@apollo/gateway";
import { SubgraphContainer } from "./models/subgraph-container";
import { SubgraphModel, SubgraphType } from "./models/subgraph.model";

type ConstructableGraphQLDataSource = new (...args: any[]) => GraphQLDataSource;

type DataSourceType = Record<SubgraphType, ConstructableGraphQLDataSource>

const datasourceType: DataSourceType = {
  'local': LocalGraphQLDataSource,
  'remote': RemoteGraphQLDataSource
}
export function buildGraphQLDataSource(subgraph: SubgraphModel): GraphQLDataSource {
  const { name } = subgraph;
  const { type } = SubgraphContainer.get(name);

  const datasource = new datasourceType[type](subgraph.transformedSchema || subgraph.schema);

  return datasource;
}