import { DirectableGraphQLObject, getDirective, MapperKind, mapSchema} from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';

interface RemoveDirective {
  if: RemoveDirectveIf;
}
enum RemoveDirectveIf {
  SITE = 'SITE',
  APP = 'APP'
}

function apply<T extends DirectableGraphQLObject>(schema: GraphQLSchema, node: T, directiveName: string) {
  const directive = getDirective(schema, node, directiveName)?.[0] as RemoveDirective;

  if (directive) {
    const channel = process.env.CHANNEL as RemoveDirectveIf;

    if (directive.if === channel)
    return null;
  }

  return node;
}

export function removeDirective() {
  const directiveName = 'remove';

  return {
    removeDirectiveTransformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {

        [MapperKind.INTERFACE_TYPE]: (type) => {
          return apply(schema, type, directiveName);
        },
        [MapperKind.INPUT_OBJECT_TYPE]: (type) => {
          return apply(schema, type, directiveName);
        },
        [MapperKind.ENUM_TYPE]: (type) => {
          return apply(schema, type, directiveName);
        },
        [MapperKind.ENUM_VALUE]: (type) => {
          return apply(schema, type, directiveName);
        },
        [MapperKind.OBJECT_TYPE]: (type) => {
          return apply(schema, type, directiveName);
        },
        [MapperKind.FIELD]: (type) => {
          return apply(schema, type, directiveName);
        }
      })
    }
  }
}