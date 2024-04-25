import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { getDirective, mapSchema, MapperKind } from '@graphql-tools/utils';

const directiveName = 'capitalizeAll';

export function capitalizeAllDirective() {
  return {
    capitalizeAllDirectiveTransformer(schema: GraphQLSchema) {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0];

          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = (parent, args, context, info) => {
              const response = resolve(parent, args, context, info);

              if (typeof response === 'string') {
                if (response.length > 1) {
                  const words = response.split(' ');

                  const capitalizedWords =  words.map(word => {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                  }).join(' ')

                  return capitalizedWords
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