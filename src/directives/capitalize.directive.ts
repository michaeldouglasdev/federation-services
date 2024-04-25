import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { getDirective, mapSchema, MapperKind } from '@graphql-tools/utils';

const directiveName = 'capitalize';

export function capitalizeDirective() {
  return {
    capitalizeDirectiveTransformer(schema: GraphQLSchema) {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = (parent, args, context, info) => {
              const response = resolve(parent, args, context, info);
              Intl.DateTimeFormat('pt-br', {})
              if (typeof response === 'string') {
                  if (response.length > 1) {
                    return response.charAt(0).toUpperCase() + response.slice(1);
                  }
                  return response.toUpperCase()
              }
            }
          }

          return fieldConfig;
        }
      })
    }
  }
}