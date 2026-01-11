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
              key: "",
              format: "",
              properties: [],
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

  const getValueSchema = getValues("schema");

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

    if (watchRequestBody.length > 0) {
      requestBody = {
        requestBody: {
          description: "",
          required: watchRequestBody.some((reqBody) => reqBody.required),
          content: watchRequestBody
            .map((requestBodyElement) => {
              return {
                [requestBodyElement.name]: {
                  schema: {
                    $ref: `#/components/schemas/${requestBodyElement.name}`,
                  },
                },
              };
            })
            .reduce<SwaggerRequestBody["content"]>((acc, response) => {
              return { ...acc, ...response };
            }, {}),
        },
      };
    }

    // Request Body
    const nestedRequestBody = (
      _requestBodyElement: ComponentSupport[] = []
    ): Record<string, SwaggerRequestBodyProperty> => {
      return _requestBodyElement
        .map<Record<string, SwaggerRequestBodyProperty>>((proper) => {
          switch (proper.format) {
            case "object":
              return {
                [proper.key]: {
                  type: "object",
                  properties: nestedRequestBody(proper.properties ?? []),
                },
              } as Record<string, SwaggerPropertyObject>;
            case "array":
              return {
                [proper.key]: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: nestedRequestBody(proper.properties ?? []),
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
            properties: nestedRequestBody(requestBodyElement.properties),
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
                "*/*": {
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
      resultErrorCodes: watchResponses.map((response) => response.codeResponse),
    };

    // Schema Properties
    let schemaProperties: Record<string, any> = {};
    let _schemaProperties: Record<string, any> = {};
    let schemaErrorProperties: Record<string, any> = {};
    if (getValueSchema.length > 0) {
      const foundSchema = getValueSchema.filter((getValue) =>
        watchResponses.some((response) => response.code === getValue.code)
      );

      schemaProperties = foundSchema
        .map((proper) => {
          const getNameResponse = watchResponses.find(
            (resp) => resp.code === proper.code
          );
          return {
            [getNameResponse?.name as never]: {
              type: "object",
              properties: proper.properties
                .map((prop) => {
                  switch (prop.format) {
                    case "object":
                    case "array":
                      return {
                        [prop.key]: {
                          $ref: `#/components/schemas/${prop.subName}`,
                        },
                      };

                    default:
                      return {
                        [prop.key]: {
                          type: prop.type,
                          example: prop.example,
                        },
                      };
                  }
                })
                .reduce((acc: any, response) => {
                  return { ...acc, ...response };
                }, {}),
            },
          };
        })
        .reduce((acc, response) => {
          return { ...acc, ...response };
        }, {});

      _schemaProperties = foundSchema
        .flatMap((proper) => {
          return proper.properties.map((prop) => {
            switch (prop.format) {
              case "array":
                return {
                  [prop.subName as never]: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: (prop.properties ?? [])
                        .map((subProp) => {
                          return {
                            [subProp.key]: {
                              type: subProp.type,
                              example: subProp.example,
                            },
                          };
                        })
                        .reduce((acc, response) => {
                          return { ...acc, ...response };
                        }, {}),
                    },
                  },
                };
              case "object":
                return {
                  [prop.subName as never]: {
                    type: "object",
                    properties: (prop.properties ?? [])
                      .map((subProp) => {
                        return {
                          [subProp.key]: {
                            type: subProp.type,
                            example: subProp.example,
                          },
                        };
                      })
                      .reduce((acc, response) => {
                        return { ...acc, ...response };
                      }, {}),
                  },
                };

              default:
                return {};
            }
          });
        })
        .filter(Boolean)
        .reduce((acc: any, response) => {
          return { ...acc, ...response };
        }, {});

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
          ...properRequestBody,
          ..._schemaProperties,
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
