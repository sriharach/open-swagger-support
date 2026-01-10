import { SwaggerParameterArray, SwaggerParameterString } from "@/types/models/swagger-interface.model";

const apiTypes = [
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
export const formatTypes = [
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
];

const schemasType = {
  array: {
    type: "array",
    items: {
      type: "string",
    },
  },
  query: {
    type: "string",
  },
  header: {
    type: "string",
  },
  path: {
    type: "string",
  },
};

export type ApiTypes = typeof apiTypes;

export default apiTypes;
