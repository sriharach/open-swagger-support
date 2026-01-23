import {
  SwaggerParameterProperty,
  SwaggerParameterString,
} from "@/types/models/swagger-interface.model";
import {
  ComponentSupport,
  OpenApiFormSupport,
  SchemaSupport,
} from "@/types/models/useForm-interface.model";

const templateSwagger = {
  openapi: "",
  info: {},
  tags: [],
  paths: {},
  components: {},
};

/**
 * Deep equality check for objects
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null)
    return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
};

/**
 * Checks if the loaded object matches the minimal OpenAPI structure
 */
export const checkFormatSwagger = (jsObject: Record<string, any>) => {
  const getKeyInitialSwagger = Object.keys(jsObject).reduce((acc, key) => {
    if (key === "openapi") return { ...acc, [key]: "" };
    if (key === "tags") return { ...acc, [key]: [] };
    return { ...acc, [key]: {} };
  }, {});
  if (!deepEqual(getKeyInitialSwagger, templateSwagger)) {
    throw new Error("Swagger format does not match minimal OpenAPI structure");
  }
};

/**
 * Recursively flattens schema properties for the form
 */
export const nestedSchema = (
  propertySchema: Record<string, any>,
  _keySchema: Record<string, any>,
): ComponentSupport[] => {
  if (!_keySchema) return [];
  return Object.entries(_keySchema).map(([key, value]) => {
    let subName = "";
    let example: any = undefined;
    let format: "array" | "object" | "" = "";
    let type: ComponentSupport["type"] = "string";
    let properties: ComponentSupport[] = [];
    let isOpenChildren = true;

    if (value?.$ref) {
      subName = value.$ref.split("/").pop() as string;
      const refSchema = propertySchema?.[subName];
      if (refSchema?.type === "object") {
        format = "object";
        properties = nestedSchema(propertySchema, refSchema.properties);
      } else if (refSchema?.type === "array") {
        format = "array";
        properties = nestedSchema(propertySchema, refSchema.items?.properties);
      }
    } else {
      // Primitive
      example = value.example;
      type = value.type;
      format = "";
      properties = [];
    }
    return {
      key,
      subName,
      example,
      format,
      isOpenChildren,
      type,
      properties,
    };
  });
};

/**
 * Converts OpenAPI object to form template
 */
export const convertOpenApiToTemplate = (
  openApi: Record<string, any>,
): OpenApiFormSupport => {
  const tagName = openApi.tags?.[0]?.name || "";
  const apiPath = Object.keys(openApi.paths)[0] || "";
  const method = apiPath ? Object.keys(openApi.paths[apiPath])[0] : "";
  const pathObj = apiPath && method ? openApi.paths[apiPath][method] : {};
  const propertySchema = openApi?.components?.schemas as Record<string, any>;
  let baseSchemaName = "";
  let baseResponseName = "";

  // Responses
  const responses = pathObj.responses
    ? Object.entries<Record<string, any>>(pathObj.responses).map(
        ([code, resp]) => {
          const contents = resp.content || {};
          const schemaRef =
            (contents["application/json"]?.schema?.$ref as string) ||
            (contents["*/*"]?.schema?.$ref as string) ||
            ("" as string);
          const responseName = schemaRef.split("/").pop() as string;
          if (code === "200") {
            baseSchemaName = responseName;
            baseResponseName = propertySchema[responseName].properties.data.$ref
              .split("/")
              .pop() as string;
          }

          const baseResponseData = propertySchema?.[responseName] || {};
          const responseNameStatus =
            baseResponseData?.properties?.status?.$ref?.split("/").pop() || "";
          const statusSchema = propertySchema?.[responseNameStatus] || {};
          const codeResponse = statusSchema.properties?.code?.example || "";
          const codeErrorMessage =
            statusSchema.properties?.message?.example || "";

          return {
            code,
            name: code === "200" ? baseResponseName : responseName || "",
            description: resp.description || "",
            codeResponse,
            message: codeErrorMessage,
          };
        },
      )
    : [];

  // Schema properties
  let mainSchemaName = "";
  if (
    baseSchemaName &&
    propertySchema?.[baseSchemaName]?.properties?.data?.$ref
  ) {
    const mainSchemaProperty = propertySchema[baseSchemaName].properties.data
      .$ref as string;
    mainSchemaName = mainSchemaProperty.split("/").pop() || "";
  }
  const schema: SchemaSupport[] = mainSchemaName
    ? [
        {
          code: "200",
          properties: nestedSchema(
            propertySchema,
            propertySchema?.[mainSchemaName]?.properties,
          ),
        },
      ]
    : [];

  // Parameter
  const parameters = (pathObj.parameters as SwaggerParameterProperty[]).map(
    (parameter) => {
      parameter;
      const parameterString = parameter.schema as SwaggerParameterString;
      let schemaParameter: Record<string, any> = {
        format: parameterString?.type || "string",
      };
      if (parameterString?.default) {
        schemaParameter = {
          ...schemaParameter,
          default: parameterString?.default,
          radioKey: "1",
        };
      }
      if (parameterString?.enum) {
        schemaParameter = {
          ...schemaParameter,
          enum: parameterString?.enum.join(",").toString(),
          radioKey: "2",
        };
      }
      return {
        ...schemaParameter,
        in: parameter.in,
        name: parameter.name,
        description: parameter.description,
        required: parameter.required,
      };
    },
  );

  return {
    info: openApi.info,
    tagName,
    baseSchemaName,
    method,
    responses,
    schema,
    apiPath,
    parameters: (parameters as never) || [],
    requestBody: pathObj.requestBody ? [pathObj.requestBody] : [],
  };
};
