import { ContextFunction } from "@apollo/server";
import { DocumentNode, GraphQLSchema } from "graphql";
import { type IncomingMessage, type ServerResponse } from 'http';


export type SubgraphModel = SubgraphLocalModel | SubgraphRemoteModel;

export type SubgraphOptions = {
  name: string;
  schema: DocumentNode;
  resolvers: object;
  type: SubgraphType;
  url: string;
  transformedSchema?: GraphQLSchema;
  url2?: string;
  context?: (context: ContextType) => any
}

export type SubgraphType = 'local' | 'remote'

type SubgraphLocalModel = SubgraphOptions & {
  type: 'local';
}

type SubgraphRemoteModel = SubgraphOptions & {
  type: 'remote';
}

type ContextType = {
  req: IncomingMessage;
  res: ServerResponse;
  cache: any;
}