import { GraphQLFieldConfig, GraphQLInputFieldConfig, GraphQLScalarType, GraphQLSchema, isNonNullType, isScalarType } from "graphql"
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';

const directiveName = 'length';
export default function lengthDirective() {
  class LimitedLengthType extends GraphQLScalarType {
    constructor(type: GraphQLScalarType, maxLength: number) {
      super({
        name: `${type.name}WithLengthAtMost${maxLength}`,

        serialize(value) {
          const newValue = type.serialize(value) as string;
          //expect(typeof newValue.length).toBe('number')
          if (newValue.length > maxLength) {
            throw new Error(
              `expected ${newValue.length.toString(10)} to be at most ${maxLength.toString(10)}`
            )
          }
          return newValue
        },

        parseValue(value) {
         const parsedValue = type.parseValue(value) as string

          if (parsedValue.length > maxLength) {
            throw new Error(
              `expected ${parsedValue.length.toString(10)} to be at most ${maxLength.toString(10)}`
            )
          }
          return value;
        },

        parseLiteral(ast) {
          const parsedValue =  type.parseLiteral(ast, {}) as string

          if (parsedValue.length > maxLength) {
            throw new Error(
              `expected ${parsedValue.length.toString(10)} to be at most ${maxLength.toString(10)}`
            )
          }
        }
      })
    }
  }

  const limitedLengthTypes: Record<string, Record<number, GraphQLScalarType>> = {}
  // {String: {5: LimitedLengthType}
  function getLimitedLengthType(type: GraphQLScalarType, maxLength: number): GraphQLScalarType {
    const limitedLengthTypesByTypeName = limitedLengthTypes[type.name]
    if (!limitedLengthTypesByTypeName) {
      const newType = new LimitedLengthType(type, maxLength)
      limitedLengthTypes[type.name] = {}
      limitedLengthTypes[type.name][maxLength] = newType
      return newType
    }

    const limitedLengthType = limitedLengthTypesByTypeName[maxLength]
    if (!limitedLengthType) {
      const newType = new LimitedLengthType(type, maxLength)
      limitedLengthTypesByTypeName[maxLength] = newType
      return newType
    }

    return limitedLengthType
  }

  function wrapType<F extends GraphQLFieldConfig<any, any> | GraphQLInputFieldConfig>(
    fieldConfig: F,
    directiveArgumentMap: Record<string, any>
  ): void {
    if (isNonNullType(fieldConfig.type) && isScalarType(fieldConfig.type.ofType)) {
      fieldConfig.type = getLimitedLengthType(fieldConfig.type.ofType, directiveArgumentMap['max'])
    } else if (isScalarType(fieldConfig.type)) {
      fieldConfig.type = getLimitedLengthType(fieldConfig.type, directiveArgumentMap['max'])
    } else {
      throw new Error(`Not a scalar type: ${fieldConfig.type.toString()}`)
    }
  }

  return {
    lengthDirectiveTypeDefs: `directive @${directiveName}(max: Int) on FIELD_DEFINITION | INPUT_FIELD_DEFINITION`,
    lengthDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig) => {
          //type: GraphQLNonNull {ofType: GraphQLScalarType}
          const lengthDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
          if (lengthDirective) {
            wrapType(fieldConfig, lengthDirective)
            return fieldConfig
          }
        },
        [MapperKind.FIELD]: fieldConfig => {
          const lengthDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
          if (lengthDirective) {
            wrapType(fieldConfig, lengthDirective)
            return fieldConfig
          }
        }
      })
  }
}