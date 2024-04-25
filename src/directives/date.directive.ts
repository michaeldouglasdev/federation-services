import { defaultFieldResolver, GraphQLSchema } from "graphql";
import { getDirective, mapSchema, MapperKind } from '@graphql-tools/utils';

const directiveName = 'date';

export function dateDirective() {
  return {
    dateDirectiveTransformer(schema: GraphQLSchema) {
      return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig, fieldName, typeName) => {
          const directive = getDirective(schema, fieldConfig, directiveName)?.[0] as DateDirective;

          if (directive) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = (parent, args, context, info) => {
              const response = resolve(parent, args, context, info);
              const { dateFormat, timeFormat } = directive;

              if (isDateType(response)) {

                const formattedDate = formatDate({
                  value: response,
                  dateFormat: dateFormat?.toLowerCase() as DateFormat,
                  timeFormat: timeFormat?.toLocaleLowerCase() as TimeFormat,
                })

                return formattedDate
              }
              if (typeof response === 'string') {

                const date = convertStringToDate(response);
                const formattedDate = formatDate({
                  value: date,
                  dateFormat: dateFormat?.toLowerCase() as DateFormat,
                  timeFormat: timeFormat?.toLocaleLowerCase() as TimeFormat,
                })

                return formattedDate
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

function isDateType(value: Date | any): value is Date {
  return value?.getMonth !== undefined
}
interface DateDirective {
  dateFormat?: "SHORT" | "MEDIUM" | "LONG" | "FULL"
  timeFormat?: "SHORT" | "MEDIUM" | "LONG" | "FULL"
}

type DateFormat = Intl.DateTimeFormatOptions['dateStyle']
type TimeFormat= Intl.DateTimeFormatOptions['timeStyle']
interface FormatDateOptions {
  value: Date;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
}

function formatDate(data: FormatDateOptions) {
  const { value, dateFormat, timeFormat } = data;
  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: dateFormat ? dateFormat.toLowerCase() as DateFormat : undefined,
    timeStyle: timeFormat ? timeFormat.toLowerCase() as TimeFormat : undefined
  }).format(value);

  return date
}

function convertStringToDate(dateString: string) {
  const hasTime = dateString.indexOf(' ') !== -1;
  const [datePart, timePart] = dateString.split(' ');
  const timeString = hasTime ? timePart : "00:00";

  const [dayString, monthString, yearString] = datePart.split('/');
  const day = parseInt(dayString, 10);
  const month = parseInt(monthString, 10) - 1;
  const year = parseInt(yearString, 10);

  const [hourString, minuteString, secondString] = timeString.split(':');
  const hour = parseInt(hourString, 10);
  const minute = parseInt(minuteString, 10);
  const second = secondString ? parseInt(secondString, 10) : 0;

  const date = new Date(year, month, day, hour, minute, second);
  return date;
}