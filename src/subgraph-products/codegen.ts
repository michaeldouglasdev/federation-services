import { CodegenConfig } from '@graphql-codegen/cli';

const codegen: CodegenConfig = {
  schema: './src/subgraph-products/schema.graphql',
  generates: {
    './src/subgraph-products/__generated-types.ts': {
      config: {
        federation: true,
        useIndexSignature: true,
        contextType: "./context#ProductContextModel",
        mappers: {
          Product: './models#ProductModel'
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