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

export type ResponseSupport = {
  code: string;
  description: string;
};

export type SchemaSupport = {
  code: string;
  properties: Array<{
    key: string;
    format: string;
    components: Array<{
      name: string
      value: string;
      type: string;
      format: string
      example: string | number;
      enum: string[] | number[];
    }>;
  }>;
};

export type OpenApiFormSupport = {
  name: string;
  apiPath: string;
  method: string;
  parameters: Array<ParameterSupport>;
  responses: Array<ResponseSupport>;
  schema: Array<SchemaSupport>;
};

export type UseFormOpenApi = OpenApiFormSupport;
