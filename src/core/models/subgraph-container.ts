import { printSchemaWithDirectives } from "@graphql-tools/utils";
import { applyDirectives } from "../apply-directives";
import { SubgraphModel } from "./subgraph.model";
import { writeFileSync } from 'fs';
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { execSync, exec } from 'child_process';

export class SubgraphContainer {
  static container = new Map<string, SubgraphModel>();

  static set(key: string, value: SubgraphModel) {
    this.container.set(key, value);
  }

  static get(key: string): SubgraphModel {
    return this.container.get(key)!;
  }

  static forEach(...callback: Parameters<Map<string, SubgraphModel>['forEach']>) {
    this.container.forEach(...callback)
  }

  static applyDirectives() {
    this.container.forEach(subgraph => {
      subgraph.transformedSchema = applyDirectives(subgraph.schema, subgraph.resolvers)
    })
  }

  static list() {
    const subgraphs = Array.from(this.container, ([_, value]) => value);
    return subgraphs;
  }

  static generateTransformedSchema() {
    console.log('generateTransformedSchema init')
    this.list().map(subgraph => {
      if (subgraph.transformedSchema) {
        const schemaString = printSchemaWithDirectives(subgraph.transformedSchema)
        writeFileSync(`src/generated/${subgraph.name}-subgraph.graphql`, schemaString);
      }
    })
    console.log('generateTransformedSchema end')
  }

  static generateSupergraph() {
    console.log('generateSupergraph init')
    execSync('rover supergraph compose --config supergraph.yaml --output supergraph.graphql')
    console.log('generateSupergraph end')
  }

  static startRouter() {
    console.log('startRouter init')
    const result = execSync('./router --supergraph supergraph.graphql --dev', { encoding: 'utf-8'})
    console.log("result", result)
    console.log('startRouter end')
  }

  static async startSubgraphServer() {
    console.log('startSubgraphServer init')
    const promises = this.list().map(async (subgraph, index) => {
      const server  = new ApolloServer({
        schema: subgraph.transformedSchema!,
      })

      const { url } = await startStandaloneServer(server, {
        listen: {
          port: 4000 + index + 1
        },
        context: ({ req, res }) => {
          const { cache } = server;
          return subgraph.context ? subgraph.context({ req, res, cache }) : { }
        }
      });

      console.log(`Subgraph ${subgraph.name} started at ${url}`);
    })

    await Promise.all(promises)
    console.log('startSubgraphServer end')
  }
}