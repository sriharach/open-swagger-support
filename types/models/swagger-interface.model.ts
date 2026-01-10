export interface SwaggerPropertyExample {
  type: string;
  example: string;
}

export interface SwaggerPropertyObject {
  type: string;
  properties: Record<string, SwaggerPropertyExample>;
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
        $ref: string;
      };
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
  schema: SwaggerParameterString | SwaggerParameterArray
}

