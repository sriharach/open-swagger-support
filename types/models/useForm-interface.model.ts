import {FieldPath} from 'react-hook-form'
export type ParameterSupport = {
  name: string;
  in: string;
  required: boolean;
  format: string;
  enum: string;
  default: string;
  radioKey?: string
  description?: string
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
  message?: string;
  codeResponse: string;
  description: string;
};
export type ComponentSupport = {
  isOpenChildren?: boolean;
  level?: number; 
  id?: string;
  subName?: string
  key: string;
  format: "array" | "object" | "";
  type: "string" | "number" | "boolean" | 'date' | 'datetime';
  enum?: Array<string | number>;
  example?: any;
  properties?: Array<ComponentSupport>;
  required?: boolean
};

export type SchemaSupport = {
  code: string;
  properties: Array<ComponentSupport>;
};

export type OpenApiFormSupport = {
  titleSwagger: string;
  tagName: string
  apiPath: string;
  method: string;
  baseSchemaName: string
  requestBody: Array<RequestBodySupport>
  parameters: Array<ParameterSupport>;
  responses: Array<ResponseSupport>;
  schema: Array<SchemaSupport>;
};

export type UseFormOpenApi = OpenApiFormSupport;
