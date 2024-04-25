import { QueryResolvers, Resolvers } from './__generated-types'
import { gql } from 'graphql-tag';
import { readFileSync } from 'fs';
import { LocalGraphQLDataSource } from '@apollo/gateway';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ProductMSDataSource2 } from './datasources/datasource';
import { ProductContextModel } from './context';
import { Injector } from '../core/injector';
import { loadCodegenConfig } from '@graphql-codegen/cli';
import { ListProductsService } from './services/list-products.service';
import { GetProductBySKUService } from './services/get-product-by-sku.service';
//loadCodegenConfig()
export const productSchema = gql(readFileSync('./src/subgraph-products/schema.graphql', 'utf-8'));

export const productResolvers: Resolvers = {
  Query: {
    product: async (parent, arg, context, info) => {
      const service = new GetProductBySKUService(
        context.datasources.product
      );

      return service.execute(arg.data.value);
    },
    productAuth: () => {
      return {
        name: 'nome autorizado',
        sku: "666"
      }
    },
    products: (_parent, _args, context) => {
      const listProductService = new ListProductsService(context.datasources.product);
      return listProductService.execute()
    }
  },
  Product: {
    heavy: async (parent) => {

      await new Promise<void>((res) => setTimeout(() => res(), 3000))

      return {
        id: 'heavy-id',
        name: 'heavy',
        description: 'So heavy'
      }
    },
    offer: () => {
      return { id: 'offerr-1',
    name: ''}
    }
  },
  Offer: {
    name: () => {
      return "Nome vindo do produto"
    }
  }
}

export const productSubgraph = buildSubgraphSchema({
  typeDefs: productSchema,
  resolvers: productResolvers
})

