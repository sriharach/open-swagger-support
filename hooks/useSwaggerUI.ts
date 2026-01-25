// libs
import { useFieldArray, useForm } from "react-hook-form";
import yaml from "js-yaml";
import { useDisclosure } from "@heroui/react";
import { useMemo, useState } from "react";

// types
import {
  ComponentSupport,
  UseFormOpenApi,
} from "@/types/models/useForm-interface.model";

import {
  SwaggerInterface,
  SwaggerParameterArray,
  SwaggerParameterProperty,
  SwaggerParameterString,
  SwaggerPropertyArray,
  SwaggerPropertyExample,
  SwaggerPropertyObject,
  SwaggerRequestBody,
  SwaggerRequestBodyProperty,
} from "@/types/models/swagger-interface.model";
import useSetSwagger from "./useSetSwagger";

const useSwaggerUI = () => {
  const [yamlDump, setYamlDump] = useState<string>("");
  const [stringJson, setStringJson] = useState("");
  const [modeOfDrawer, setModeOfDrawer] = useState<"generate" | "import" | "">(
    "",
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formProvider = useForm<UseFormOpenApi>({
    mode: "all",
    defaultValues: {
      info: {
        title: "Swagger Support",
        version: "1.0.0",
      },
      tagName: "Swagger Generator",
      baseSchemaName: "MainPointApi",
      method: "get",
      responses: [
        {
          code: "200",
          name: "Sample",
          description: "",
          codeResponse: "",
        },
      ],
      schema: [
        {
          code: "200",
          properties: [
            {
              example: "hello",
              format: "",
              isOpenChildren: false,
              key: "hello",
              type: "string",
            },
          ],
        },
      ],
    },
  });

  // feature import convert input swagger
  useSetSwagger(formProvider, stringJson);

  const { control, watch } = formProvider;

  const watchInfo = watch("info");
  const watchApiPath = watch("apiPath");
  const watchMethod = watch("method");
  const watchTagName = watch("tagName");
  const watchBaseSchemaName = watch("baseSchemaName");
  const watchParameters = watch("parameters");
  const watchRequestBody = watch("requestBody");
  const watchResponses = watch("responses");

  const getValueSchema = watch("schema");

  const parametersFieldArray = useFieldArray({
    control: control,
    name: "parameters",
  });

  const requestBodyFieldArray = useFieldArray({
    control: control,
    name: "requestBody",
  });

  const responsesFieldArray = useFieldArray({
    control: control,
    name: "responses",
  });

  const schemaFieldArray = useFieldArray({
    control: control,
    name: "schema",
  });

  // handle state control fields
  // useEffect(() => {
  //   if (getValuesResponse.length < schemaFieldArray.fields.length) {
  //     schemaFieldArray.remove(schemaFieldArray.fields.length - 1);
  //   }
  // }, [getValuesResponse, schemaFieldArray]);

  const generateOpenApiSpec = useMemo(() => {
    if (!watchApiPath || !watchMethod || !watchBaseSchemaName) return undefined;

    // Parameters
    const parameters = watchParameters.map<SwaggerParameterProperty>(
      (parameter) => {
        const parameterEnum = parameter?.enum
          ? parameter.enum.split(",").map((item) => item.trim())
          : [];

        let resultParameterSchema:
          | SwaggerParameterArray
          | SwaggerParameterString = {
          type: "string",
          default: parameter.default,
        };

        if (parameterEnum.length > 0 && parameterEnum[0] !== "") {
          resultParameterSchema = {
            ...resultParameterSchema,
            default: parameterEnum ? parameterEnum[0] : "",
            enum: parameterEnum ? parameterEnum : [],
          };
        }

        if (parameter.in === "array") {
          resultParameterSchema = {
            type: "array",
            items: {
              type: parameter.format || "string",
            },
          };
        }
        return {
          in: parameter.in,
          name: parameter.name,
          required: parameter.required,
          schema: resultParameterSchema,
          description: parameter.description,
          explode: true,
        };
      },
    );

    // Request Body
    let requestBody: Record<string, SwaggerRequestBody> = {};
    let properRequestBody: Record<string, SwaggerInterface> = {};

    // Handles nested request body generation for OpenAPI spec
    const nestedRequestBody = (
      _requestBodyElement: ComponentSupport[] = [],
    ): Record<string, any> =>
      _requestBodyElement.reduce((acc, proper) => {
        let requestBodyProperty: Record<string, any>;
        
        if (proper.format === "array") {
          // If array items have properties, recursively process them
          const resultProper = (proper.properties ?? []).reduce(
            (acc, _proper) => {
              let childProper: Record<string, any>;
              if (_proper.format === "object" || _proper.format === "array") {
                childProper = {
                  [_proper.key]: nestedRequestBody(_proper.properties),
                };
              } else {
                childProper = {
                  [_proper.key]: _proper.example,
                };
              }
              return { ...acc, ...childProper };
            },
            {},
          );
          requestBodyProperty = {
            [proper.key]: [resultProper],
          };
        } else if (proper.format === "object") {
          // Recursively process object properties
          requestBodyProperty = {
            [proper.key]: (proper.properties ?? []).reduce(
              (acc) => ({
                ...acc,
                ...nestedRequestBody(proper.properties),
              }),
              {},
            ),
          };
        } else {
          // Primitive value
          requestBodyProperty = {
            [proper.key]: proper.example,
          };
        }

        return { ...acc, ...requestBodyProperty };
      }, {});

    if (watchRequestBody.length > 0) {
      requestBody = {
        requestBody: {
          description: "",
          required: watchRequestBody.some((reqBody) => reqBody.required),
          content: {
            "application/json": {
              schema: {
                oneOf: watchRequestBody.map((requestBodyElement) => {
                  return {
                    $ref: `#/components/schemas/${requestBodyElement.name}`,
                  };
                }),
                title: "RequestBody",
              },
              examples: watchRequestBody.reduce((acc, response) => {
                let requestBodyElement = {
                  [response.name]: {
                    summary: response.name,
                    value: nestedRequestBody(response.properties),
                  },
                };
                return { ...acc, ...requestBodyElement };
              }, {}),
            },
          },
        },
      };
    }

    // Request Body schema
    const nestedSchemaBody = (
      _requestBodyElement: ComponentSupport[] = [],
    ): Record<string, SwaggerRequestBodyProperty> => {
      return _requestBodyElement.reduce<
        Record<string, SwaggerRequestBodyProperty>
      >((acc, proper) => {
        let schemaBodyElement: Record<string, SwaggerRequestBodyProperty>;
        if (proper.format === "object") {
          schemaBodyElement = {
            [proper.key]: {
              type: "object",
              properties: nestedSchemaBody(proper.properties ?? []),
            },
          } as Record<string, SwaggerPropertyObject>;
        } else if (proper.format === "array") {
          schemaBodyElement = {
            [proper.key]: {
              type: "array",
              title: proper.key,
              items: {
                type: "object",
                properties: nestedSchemaBody(proper.properties ?? []),
              },
            },
          } as unknown as Record<string, SwaggerPropertyArray>;
        } else {
          schemaBodyElement = {
            [proper.key]: {
              type: proper.type,
              example: proper.example,
            } as SwaggerPropertyExample,
          };
        }

        return { ...acc, ...schemaBodyElement };
      }, {});
    };

    properRequestBody = watchRequestBody.reduce((acc, proper) => {
      let requestBodyProperty: Record<string, SwaggerInterface>;
      requestBodyProperty = {
        [proper.name]: {
          type: "object",
          properties: nestedSchemaBody(proper.properties),
        },
      };

      return { ...acc, ...requestBodyProperty };
    }, {});

    // Responses
    const responsesCocoon = {
      resultResponse: watchResponses.reduce((acc, response) => {
        let responseResult = {
          [response.code]: {
            description: response.description,
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${
                    response.code >= "400" ? response.name : watchBaseSchemaName
                  }`,
                },
              },
            },
          },
        };
        return { ...acc, ...responseResult };
      }, {}),
      initialResponse: {
        $ref: `#/components/schemas/${watchResponses[0]?.name}`,
      },
    };

    // Schema Properties
    let schemaProperties: Record<string, SwaggerInterface> = {},
      schemaKeysProperty = {};
    const schemaKeysetProperties: Record<string, any>[] = [];
    let schemaErrorProperties: Record<string, any> = {};

    const nestedSchemaProperty = (
      schemas: ComponentSupport[] = [],
    ): Record<string, any> =>
      schemas.reduce<Record<string, any>>((acc, proper) => {
        let schema: Record<string, any>;
        const objectRef = {
          [proper.key]: { $ref: `#/components/schemas/${proper.subName}` },
        };

        if (proper.format === "array") {
          const arraySchema = {
            [proper.key]: {
              type: "array",
              items: {
                type: "object",
                properties: nestedSchemaProperty(proper.properties),
              },
            },
          };
          schemaKeysetProperties.push(
            proper.subName
              ? {
                  [proper.subName]: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: nestedSchemaProperty(proper.properties),
                    },
                  },
                }
              : arraySchema,
          );
          schema = proper.subName ? objectRef : arraySchema;
        } else if (proper.format === "object") {
          const objectSchema = {
            [proper.key]: {
              type: "object",
              properties: nestedSchemaProperty(proper.properties),
            },
          };
          schemaKeysetProperties.push(
            proper.subName
              ? {
                  [proper.subName]: {
                    type: "object",
                    properties: nestedSchemaProperty(proper.properties),
                  },
                }
              : objectSchema,
          );
          schema = proper.subName ? objectRef : objectSchema;
        } else {
          let autoFormatDateTime: SwaggerPropertyExample;
          if (proper.type === "date") {
            autoFormatDateTime = {
              type: "string",
              ...(proper.example ? { example: proper.example } : {}),
              format: "date",
            };
          } else if (proper.type === "datetime") {
            autoFormatDateTime = {
              type: "string",
              ...(proper.example ? { example: proper.example } : {}),
              format: "date-time",
            };
          } else {
            autoFormatDateTime = {
              type: proper.type,
              example: proper.example,
            };
          }
          schema = {
            [proper.key]: autoFormatDateTime,
          };
        }

        return { ...acc, ...schema };
      }, {});

    if (getValueSchema.length > 0) {
      const foundSchema = getValueSchema.find((getValue) =>
        watchResponses.some((response) => response.code === getValue.code),
      );
      if (!foundSchema) return;

      schemaProperties = {
        [watchResponses[0]?.name]: {
          type: "object",
          properties: nestedSchemaProperty(foundSchema.properties),
        },
      };
      schemaKeysProperty = schemaKeysetProperties.reduce(
        (acc, response) => ({ ...acc, ...response }),
        {},
      );

      // error case
      const errorCase = watchResponses.filter((proper) => proper.code >= "400");
      if (errorCase) {
        schemaErrorProperties = errorCase.reduce((acc, proper) => {
          const resultSchemaError = {
            [proper.name]: {
              type: "object",
              properties: {
                status: {
                  $ref: `#/components/schemas/StatusResponseError${proper.name}`,
                },
              },
            },
            ["StatusResponseError".concat(proper.name)]: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: proper.codeResponse,
                },
                type: {
                  type: "string",
                  example: "error",
                },
                message: {
                  type: "string",
                  example: proper.message,
                },
              },
            },
          };
          return { ...acc, ...resultSchemaError };
        }, {});
      }
    }

    return {
      openapi: "3.0.0",
      info: watchInfo,
      tags: [
        {
          name: watchTagName,
          description: "",
        },
      ],
      paths: {
        [watchApiPath]: {
          [watchMethod]: {
            tags: [watchTagName],
            summary: "",
            parameters: parameters,
            responses: responsesCocoon.resultResponse,
            ...requestBody,
          },
        },
      },
      components: {
        schemas: {
          [watchBaseSchemaName]: {
            type: "object",
            properties: {
              status: {
                $ref: "#/components/schemas/StatusResponse",
              },
              data: { ...responsesCocoon.initialResponse },
            },
          },
          ...schemaProperties,
          ...schemaKeysProperty,
          ...properRequestBody,
          ...schemaErrorProperties,
          StatusResponse: {
            type: "object",
            properties: {
              code: {
                type: "string",
                example: watchResponses[0]?.codeResponse || "10000",
              },
              type: {
                type: "string",
                example: "info",
              },
              message: {
                type: "string",
                example: "success",
              },
            },
          },
        },
      },
    };
  }, [
    watchInfo,
    watchMethod,
    watchApiPath,
    watchTagName,
    watchBaseSchemaName,
    watchParameters,
    watchResponses,
    getValueSchema,
    watchRequestBody,
  ]);

  const onSetTextYaml = (yaml: string) => setStringJson(yaml);

  // YAML generation and drawer open
  const onGenerateYaml = () => {
    const yamlDump = yaml.dump(generateOpenApiSpec);
    onOpen();
    setYamlDump(yamlDump);
    setModeOfDrawer("generate");
  };

  const onImportYaml = () => {
    onOpen();
    setModeOfDrawer("import");
  };

  return {
    yamlDump,
    stringJson,
    isOpen,
    formProvider,
    parametersFieldArray,
    requestBodyFieldArray,
    responsesFieldArray,
    schemaFieldArray,
    generateOpenApiSpec,
    modeOfDrawer,
    onGenerateYaml,
    onImportYaml,
    onOpenChange,
    onSetTextYaml,
  };
};

export default useSwaggerUI;
