export type ParameterSupportSchema = {
  type: string;
  enum: string[];
};

export type ParameterSupport = {
  name: string;
  in: string;
  required: boolean;
  format?: string;
  schema: ParameterSupportSchema;
};

export type RequestBodySupport = {
  description?: string;
  required?: boolean;
  name: string;
  properties: Array<ComponentSupport>;
}

export type ResponseSupport = {
  code: string;
  name: string;
  description: string;
};
export type ComponentSupport = {
  id?: string;
  key: string;
  format: "array" | "object" | "";
  type: "string" | "number" | "boolean";
  enum?: Array<string | number>;
  example?: string | number;
  properties?: Array<ComponentSupport>;
};

export type SchemaSupport = {
  code: string;
  properties: Array<ComponentSupport>;
};

export type OpenApiFormSupport = {
  name: string;
  apiPath: string;
  method: string;
  requestBody: Array<RequestBodySupport>
  parameters: Array<ParameterSupport>;
  responses: Array<ResponseSupport>;
  schema: Array<SchemaSupport>;
};

export type UseFormOpenApi = OpenApiFormSupport;
