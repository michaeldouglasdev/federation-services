import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';

const directiveName = 'lower';

export function lowerDirective() {
  return {
    lowerDirectiveTransformer(schema: GraphQLSchema) {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;

            fieldConfig.resolve = (parent, args, context, info) => {
              const response = resolve(parent, args, context, info);

              if (typeof response === 'string') {
                return response.toLowerCase();
              }

              return response
            }
          }

          return fieldConfig;
        }
      })
    }
  }
}