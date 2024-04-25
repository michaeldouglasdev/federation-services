import { execSync } from 'child_process';

export function executeSubgraphCompose() {
  execSync("rover supergraph compose --config supergraph.yaml --output supergraph.graphql");
}
