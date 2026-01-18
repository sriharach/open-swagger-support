export interface apiFormatSchema {
  label: string;
  value: string;
}

const apiTypes: apiFormatSchema[] = [
  {
    label: "Array",
    value: "array",
  },
  {
    label: "Header",
    value: "header",
  },
  {
    label: "Path",
    value: "path",
  },
  {
    label: "Query",
    value: "query",
  },
];
export const formatTypes: apiFormatSchema[] = [
  {
    label: "String",
    value: "string",
  },
  {
    label: "Number",
    value: "number",
  },
  {
    label: "Boolean",
    value: "boolean",
  },
  {
    label: "Date",
    value: "date",
  },
  {
    label: "Date/Time",
    value: "datetime",
  },
];

export const formatSchemasType: apiFormatSchema[] = [
  {
    label: "None",
    value: "",
  },
  {
    label: "Object",
    value: "object",
  },
  {
    label: "Array",
    value: "array",
  },
];

export const formatSchemaValue: apiFormatSchema[] = [
  {
    label: "Value",
    value: "value",
  },
];

export type ApiTypes = typeof apiTypes;

export default apiTypes;
