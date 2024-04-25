import { GraphQLFieldConfig, GraphQLInputFieldConfig, GraphQLScalarType, GraphQLSchema, isNonNullType, isScalarType } from "graphql";
import { getDirective, mapSchema, MapperKind} from '@graphql-tools/utils';
import { Validators } from "./utils/validators/validator";
import { ValidatorMinStrategy, ValidatorMinLengthStrategy, ValidatorMaxLengthStrategy, ValidatorMaxStrategy, ValidatorIsEmailStrategy} from './utils/validators'
const directiveName = "validate";
const validators = new Validators()
validators.add(new ValidatorMinStrategy())
validators.add(new ValidatorMinLengthStrategy())
validators.add(new ValidatorMaxStrategy())
validators.add(new ValidatorMaxLengthStrategy())
validators.add(new ValidatorIsEmailStrategy())

export function validateDirective() {

  class ValidateType extends GraphQLScalarType {
   constructor(
    type: GraphQLScalarType, args: any
   ) {
    super({
      name: `${type.name}WithValidate`,
      serialize(value) {
        const serializedValue = type.serialize(value);

        return serializedValue;
      },
      parseValue(value) {
        const parsedValue = type.parseValue(value);

        const listArgs = Object.keys(args)
        listArgs.map(arg => {
          validators.get(arg)?.execute({
            args,
            type: type.name,
            value: parsedValue
          })
        })

        return parsedValue;
      },
      parseLiteral(value) {
        const parsedValue = type.parseLiteral(value);

        return parsedValue;
      }
    })
   }
  }

  function getValidateType(type: GraphQLScalarType, args: any): GraphQLScalarType {
    const validateType = new ValidateType(type, args);
    return validateType;
  }

  function wrapType<T extends GraphQLFieldConfig<any, any> | GraphQLInputFieldConfig>(
    fieldConfig: T,
    directiveArgumentMap: Record<string, any>
  ) {
    if (isNonNullType(fieldConfig.type) && isScalarType(fieldConfig.type.ofType)) {
      fieldConfig.type = getValidateType(fieldConfig.type.ofType, directiveArgumentMap);
    } else if (isScalarType(fieldConfig.type)) {
      fieldConfig.type = getValidateType(fieldConfig.type, directiveArgumentMap);
    } else {
      throw new Error(`Not a Scalar Type: ${fieldConfig.type.toString()}`)
    }
  }

  return {
    validateDirectiveTransformer: (schema: GraphQLSchema) => {
      return mapSchema(schema, {
        [MapperKind.INPUT_OBJECT_FIELD]: (fieldConfig) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0]

          if (directive) {
            wrapType(fieldConfig, directive)
            return fieldConfig;
          }
        }
      })
    }
  }
}