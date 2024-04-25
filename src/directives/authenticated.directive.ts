import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from 'graphql';

const directiveName = 'authenticated';

export function authenticatedDirective() {
  return {
    authenticatedDirectiveTransformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (directive) {
            const { resolve = defaultFieldResolver} = fieldConfig;

            fieldConfig.resolve = (parent, args, context, info ) => {
              const { user } = context;

              if (!user) {
                throw new GraphQLError('UNAUTHORIZED');
              }

              const response = resolve(parent, args, context, info)
              return response
            }
          }

          return fieldConfig;
        }
      })
    }
  }
}