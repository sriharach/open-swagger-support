// libs
import { useFieldArray, useForm } from "react-hook-form";
import yaml from "js-yaml";
import { useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

// types
import {
  ComponentSupport,
  type UseFormOpenApi,
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

const useSwaggerUI = () => {
  const [yamlDump, setYamlDump] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formProvider = useForm<UseFormOpenApi>({
    defaultValues: {
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
              example: "",
              format: "",
              isOpenChildren: false,
              key: "",
              type: "string",
            },
          ],
        },
      ],
    },
  });

  const { control, getValues, watch } = formProvider;

  const watchApiPath = watch("apiPath");
  const watchMethod = watch("method");
  const watchApiName = watch("name");
  const watchParameters = watch("parameters");
  const watchRequestBody = watch("requestBody");
  const watchResponses = watch("responses");

  const getValueSchema = watch("schema");
  console.log("getValueSchema", getValueSchema);

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
    if (!watchApiPath || !watchApiName || !watchMethod) return undefined;

    // Parameters
    const parameters = watchParameters.map<SwaggerParameterProperty>(
      (parameter) => {
        const parameterEnum = parameter?.enum
          .split(",")
          .map((item) => item.trim());

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
          explode: true,
        };
      }
    );

    // Request Body
    let requestBody: Record<string, SwaggerRequestBody> = {};
    let properRequestBody: Record<string, SwaggerInterface> = {};

    // Handles nested request body generation for OpenAPI spec
    const nestedRequestBody = (
      _requestBodyElement: ComponentSupport[] = []
    ): Record<string, any> => {
      return _requestBodyElement
        .map((proper): Record<string, any> => {
          switch (proper.format) {
            // If array items have properties, recursively process them
            case "array":
              return {
                [proper.key]: proper.properties?.map((_proper) => {
                  switch (_proper.format) {
                    case "object":
                    case "array":
                      return {
                        [_proper.key]: nestedRequestBody(_proper.properties),
                      };

                    default:
                      return {
                        [_proper.key]: _proper.example,
                      };
                  }
                }),
              };
            case "object":
              // Recursively process object properties
              return {
                [proper.key]: proper.properties
                  ?.map((_proper) => nestedRequestBody(proper.properties))
                  .reduce((acc, response) => {
                    return { ...acc, ...response };
                  }, {}),
              };

            default:
              // Primitive value
              return {
                [proper.key]: proper.example,
              };
          }
        })
        .reduce((acc, response) => {
          return { ...acc, ...response };
        }, {});
    };

    if (watchRequestBody.length > 1) {
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
                title: watchRequestBody[0]?.name ?? "",
              },
              examples: watchRequestBody
                .map((requestBodyElement) => {
                  return {
                    [requestBodyElement.name]: {
                      summary: requestBodyElement.name,
                      value: nestedRequestBody(requestBodyElement.properties),
                    },
                  };
                })
                .reduce((acc, response) => {
                  return { ...acc, ...response };
                }, {}),
            },
          },
        },
      };
    } else if (watchRequestBody[0]) {
      requestBody = {
        requestBody: {
          description: "",
          required: watchRequestBody.some((reqBody) => reqBody.required),
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${watchRequestBody[0]?.name}`,
              },
            },
          },
        },
      };
    }

    // Request Body schema
    const nestedSchemaBody = (
      _requestBodyElement: ComponentSupport[] = []
    ): Record<string, SwaggerRequestBodyProperty> => {
      return _requestBodyElement
        .map<Record<string, SwaggerRequestBodyProperty>>((proper) => {
          switch (proper.format) {
            case "object":
              return {
                [proper.key]: {
                  type: "object",
                  properties: nestedSchemaBody(proper.properties ?? []),
                },
              } as Record<string, SwaggerPropertyObject>;
            case "array":
              return {
                [proper.key]: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: nestedSchemaBody(proper.properties ?? []),
                  },
                },
              } as unknown as Record<string, SwaggerPropertyArray>;
            default:
              return {
                [proper.key]: {
                  type: proper.type,
                  example: proper.example,
                } as SwaggerPropertyExample,
              };
          }
        })
        .reduce<Record<string, SwaggerRequestBodyProperty>>((acc, response) => {
          return { ...acc, ...response };
        }, {});
    };

    properRequestBody = watchRequestBody
      .map<Record<string, SwaggerInterface>>((requestBodyElement) => {
        return {
          [requestBodyElement.name]: {
            type: "object",
            properties: nestedSchemaBody(requestBodyElement.properties),
          },
        };
      })
      .reduce((acc, response) => {
        return { ...acc, ...response };
      }, {});

    // Responses
    const responsesCocoon = {
      resultResponse: watchResponses
        .map((response) => {
          return {
            [response.code]: {
              description: response.description,
              content: {
                "application/json": {
                  schema: {
                    $ref: `#/components/schemas/${
                      response.code >= "400" ? response.name : watchApiName
                    }`,
                  },
                },
              },
            },
          };
        })
        .reduce((acc, response) => {
          return { ...acc, ...response };
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
      schemas: ComponentSupport[] = []
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
              : arraySchema
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
              : objectSchema
          );
          schema = proper.subName ? objectRef : objectSchema;
        } else {
          schema = {
            [proper.key]: {
              type: proper.type,
              example: proper.example,
            } as SwaggerPropertyExample,
          };
        }

        return { ...acc, ...schema };
      }, {});

    if (getValueSchema.length > 0) {
      const foundSchema = getValueSchema.find((getValue) =>
        watchResponses.some((response) => response.code === getValue.code)
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
        {}
      );

      const errorCase = watchResponses.filter((proper) => proper.code >= "400");
      if (errorCase) {
        schemaErrorProperties = errorCase
          .map((proper): Record<string, any> => {
            return {
              [proper.name]: {
                type: "object",
                properties: {
                  status: {
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
                },
              },
            };
          })
          .reduce((acc: any, response) => {
            return { ...acc, ...response };
          }, {});
      }
    }

    return {
      openapi: "3.0.0",
      info: {
        title: "Swagger Support Spec",
        description: "",
        version: "1.0.0",
      },
      tags: [
        {
          name: watchApiName,
          description: "",
        },
      ],
      paths: {
        [watchApiPath]: {
          [watchMethod]: {
            tags: [watchApiName],
            summary: "",
            parameters: parameters,
            responses: responsesCocoon.resultResponse,
            ...requestBody,
          },
        },
      },
      components: {
        schemas: {
          [watchApiName]: {
            type: "object",
            properties: {
              status: {
                $ref: "#/components/schemas/statusResponse",
              },
              data: { ...responsesCocoon.initialResponse },
            },
          },
          ...schemaProperties,
          ...schemaKeysProperty,
          ...properRequestBody,
          ...schemaErrorProperties,
          statusResponse: {
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
    watchApiName,
    watchMethod,
    watchApiPath,
    watchParameters,
    watchResponses,
    getValueSchema,
    watchRequestBody,
  ]);
  // YAML generation and drawer open
  const handleGenerateYaml = () => {
    const yamlDump = yaml.dump(generateOpenApiSpec);
    setYamlDump(yamlDump);
    onOpen();
  };

  return {
    yamlDump,
    isOpen,
    formProvider,
    parametersFieldArray,
    requestBodyFieldArray,
    responsesFieldArray,
    schemaFieldArray,
    generateOpenApiSpec,
    handleGenerateYaml,
    onOpenChange,
  };
};

export default useSwaggerUI;
