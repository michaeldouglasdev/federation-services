#!/usr/local/bin/bash

# Verifica se o nome foi fornecido
if [ -z "$1" ]
  then
    echo "Erro: Nome do subgraph não fornecido"
    exit 1
fi

BC=$1

# Define o nome do subgraph
SUBGRAPH_NAME="subgraph-${BC}"

# Define a visibilidade do repositório (padrão: privado)
VISIBILITY=${2:-private}

#gh repo create $REPO_NAME --$VISIBILITY --confirm

echo "Repositório '$SUBGRAPH_NAME' criado com sucesso!"

# Cria a estrutura de diretórios e arquivos localmente
mkdir -p $SUBGRAPH_NAME/src/resolvers
cat << EOF > $SUBGRAPH_NAME/src/resolvers/Query.ts
import { QueryResolvers } from '__generated__/resolvers-types';

export const Query: QueryResolvers = {
  example: (_parent, _args, _context, _info) => {
    return {
      id: 'id-1',
      name: 'name-1'
    }
  }
};
EOF

cat << EOF > $SUBGRAPH_NAME/src/resolvers/Mutation.ts
import { ExampleModel } from '@models/example';
import { MutationResolvers } from '__generated__/resolvers-types';

export const Mutation: MutationResolvers = {
  createExample: (_parent, args, _context, _info) => {
    const { name } = args.createExampleInput;
    const example: ExampleModel = {
      id: 'id-1',
      name
    }

    return {
      code: 200,
      message: 'Example created successfully',
      success: true,
      example
    }
  }
};
EOF

cat << EOF > $SUBGRAPH_NAME/src/resolvers/Example.ts
import { ExampleResolvers } from '__generated__/resolvers-types';

export const Example: ExampleResolvers = {

}
EOF

# Cria index.ts para exportar todos os resolvers
cat << EOF > $SUBGRAPH_NAME/src/resolvers/index.ts
import { Query } from './Query';
import { Mutation } from './Mutation';

export const resolvers${BC^} = {
  ...Query,
  ...Mutation,
};

EOF

# Cria o codegen para gerar interfaces TS com base no schema
cat << EOF > $SUBGRAPH_NAME/codegen.ts
import { CodegenConfig } from '@graphql-codegen/cli';

const codegen: CodegenConfig = {
  schema: './schema.graphql',
  generates: {
    './src/__generated__/resolvers-types.ts': {
      config: {
        federation: true,
        useIndexSignature: true,
        contextType: "./context/context#${BC^}ContextModel",
        mappers: {
          Example: '../models#ExampleModel'
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

EOF

cat << EOF > $SUBGRAPH_NAME/tsconfig.json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["ES2020", "ESNext.AsyncIterable"],
    "module": "commonjs",
    //"rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@models/*": ["models/*"],
      "@resolvers/*": ["resolvers/*"],
      "@services/*": ["services/*"],
      "@repositories/*": ["repositories/*"],
      "@datasources": ["datasources/*"],
      "@generated": ["__generated__/*"]
    },
    "typeRoots": [
      "./src/@types"
    ],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
EOF

# Cria o arquivo de schema
cat << EOF > $SUBGRAPH_NAME/schema.graphql
# Documentação sobre as diretivas do Apollo Federation
# https://www.apollographql.com/docs/federation/federated-types/federated-directives/

# Instale a extensão Apollo GraphQL
# https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo

extend schema
  @link(
    url: "https://specs.apollo.dev/federation/v2.6",
    import: [
      "@key", "@extends", "@shareable", "@external", "@provides", "@requires", "@inaccessible",
      "@composeDirective", "@interfaceObject", "@override", "@tag"
    ]
  )


type Example @inaccessible {
  id: ID!
  name: String!
}

type Query {
  example(id: ID!): Example! @inaccessible
}

type Mutation {
  createExample(createExampleInput: CreateExampleInput!): CreateExampleResponse! @inaccesible
}

interface MutationResponse {
  "Similar to HTTP status code, represents the status of the mutation"
  code: Int!
  "Indicates whether the mutation was successful"
  success: Boolean!
  "Human-readable message for the UI"
  message: String!
}

type CreateExampleResponse implements MutationResponse {
  "Similar to HTTP status code, represents the status of the mutation"
  code: Int!
  "Indicates whether the mutation was successful"
  success: Boolean!
  "Human-readable message for the UI"
  message: String!
  "Created example"
  example: Example # Optional, because the mutation may fail
}

input CreateExampleInput @inaccessible {
  "Example name"
  name: String!
}
EOF

# Cria a estrutura de diretório models e arquivos localmente

mkdir -p $SUBGRAPH_NAME/src/models
cat << EOF > $SUBGRAPH_NAME/src/models/example.ts
export interface ExampleModel {
  id: string;
  name: string;
}
EOF

# Cria o index para exportar todas as models
cat << EOF > $SUBGRAPH_NAME/src/models/index.ts
export * from '@models/example';

EOF

# Cria o contexto da requisição
mkdir $SUBGRAPH_NAME/src/context
cat << EOF > $SUBGRAPH_NAME/src/context/context.ts
import { ExampleModel } from '@models/example';

export interface ${BC^}ContextModel {
  example: ExampleModel
}

EOF


# Cria um package.json básico
cat << EOF > $SUBGRAPH_NAME/package.json
{
  "name": "$SUBGRAPH_NAME",
  "version": "1.0.0",
  "description": "Subgraph da BC ${BC^}.",
  "main": "src/index.js",
  "author": "MD",
  "license": "ISC",
  "scripts": {
    "start": "nodemon --ext ts,graphql --exec ts-node server.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "codegen": "graphql-codegen"
  },
  "dependencies": {
    "@apollo/server": "4.10.1",
    "@apollo/subgraph": "2.7.2",
    "graphql": "17.0.0-alpha.3",
    "nodemon": "3.1.0"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "5.0.2",
    "@graphql-codegen/typescript": "4.0.6",
    "@graphql-codegen/typescript-resolvers": "4.0.6",
    "@types/node": "20.12.5",
    "typescript": "5.4.3"
  },
  "resolutions": {
    "jackspeak": "2.1.1"
  }
}
EOF

# Cria gitignore
cat << EOF > $SUBGRAPH_NAME/.gitignore
# Ignore the compiled output.
dist/

# TypeScript incremental compilation cache
*.tsbuildinfo

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage (from Jest)
coverage/
__temp

# Node modules
node_modules/

# Mac OS
.DS_Store

EOF

# Instala as dependências e executa o codegen
cd ${SUBGRAPH_NAME}
yarn install
yarn codegen