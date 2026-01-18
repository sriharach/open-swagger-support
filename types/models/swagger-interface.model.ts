export interface SwaggerPropertyExample {
  type: string;
  example?: any;
  format?: string
}

export interface SwaggerPropertyObject {
  type: string;
  properties: Record<string, SwaggerPropertyExample>;
  required?: string[];
}

export interface SwaggerPropertyArray {
  type: string;
  items: Record<string, SwaggerPropertyObject>;
}

export interface SwaggerInterface {
  type: string;
  properties: Record<
    string,
    SwaggerPropertyExample | SwaggerPropertyObject | SwaggerPropertyArray
  >;
  required?: string[];
}

export type SwaggerRequestBodyProperty =
  | SwaggerPropertyExample
  | SwaggerPropertyObject
  | SwaggerPropertyArray;

export interface SwaggerRequestBody {
  description: string;
  required: boolean;
  content: Record<
    string,
    {
      schema: {
        title?: string;
        oneOf?: Array<{ $ref: string }>;
        $ref?: string;
      };
      examples?: Record<
        string,
        {
          summary: string;
          value: any;
        }
      >;
    }
  >;
}

export interface SwaggerParameterArray {
  type: string;
  items: {
    type: string;
  };
}

export interface SwaggerParameterString {
  type: string;
  default: string;
  enum?: string[];
}
export interface SwaggerParameterProperty {
  name: string;
  in: string;
  required: boolean;
  schema: SwaggerParameterString | SwaggerParameterArray;
  description?: string
}
