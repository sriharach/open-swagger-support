// libs
import { useFieldArray, useForm } from "react-hook-form";

// types
import { type UseFormOpenApi } from "@/types/models/useForm";
import { useEffect, useMemo } from "react";
import { mapSchemaTypes } from "@/constant/api-type";

const useSwaggerUI = () => {
  const formProvider = useForm<UseFormOpenApi>({
    defaultValues: {
      responses: [
        {
          code: "200",
          name: "Sample",
          description: "",
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
  const getValuesResponse = getValues("responses");

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

  useEffect(() => {
    if (getValuesResponse.length < schemaFieldArray.fields.length) {
      schemaFieldArray.remove(schemaFieldArray.fields.length - 1);
    }
  }, [getValuesResponse, schemaFieldArray]);

  const generateOpenApiSpec = useMemo(() => {
    if (!watchApiPath || !watchApiName || !watchMethod) return undefined;

    const parameters = watchParameters.map((parameter) => {
      return {
        name: parameter.name,
        in: parameter.in,
        required: parameter.required,
        schema: mapSchemaTypes(
          parameter.in as keyof typeof mapSchemaTypes,
          parameter.format as never
        ),
      };
    });

    const responsesCocoon = {
      resultResponse: watchResponses
        .map((response) => {
          return {
            [response.code]: {
              description: response.description,
              content: {
                "*/*": {
                  schema: {
                    $ref: `#/components/schemas/${watchApiName}`,
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
        $ref: `#/components/schemas/${watchResponses[0].name}`,
      },
    };

    let requestBody: Record<string, any> = {};
    let properRequestBody: Record<string, any> = {};
    const requestBodyElement = watchRequestBody[0];
    if (requestBodyElement) {
      requestBody = {
        requestBody: {
          description: requestBodyElement.description || "",
          content: {
            "*/*": {
              schema: {
                $ref: `#/components/schemas/${requestBodyElement.name}`,
              },
            },
          },
          required: requestBodyElement.required || false,
        },
      };

      properRequestBody = {
        [requestBodyElement.name]: {
          type: "object",
          properties: (requestBodyElement.properties ?? [])
            .map((proper) => {
              return {
                [proper.key]: {
                  type: proper.type,
                  example: proper.example,
                },
              };
            })
            .reduce((acc, response) => {
              return { ...acc, ...response };
            }, {}),
        },
      };
    }

    let schemaProperties: Record<string, any> = {};
    let _schemaProperties: Record<string, any> = {};
    if (getValueSchema.length > 0) {
      const foundSchema = getValueSchema.filter((getValue) =>
        watchResponses.some((response) => response.code === getValue.code)
      );

      schemaProperties = foundSchema
        .map((proper) => {
          const getNameResponse = watchResponses.find(
            (resp) => resp.code === proper.code
          )?.name;
          return {
            [getNameResponse as never]: {
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
                    properties: proper.properties
                      .map((prop) => {
                        return {
                          [prop.key]: {
                            type: prop.type,
                            example: prop.example,
                          },
                        };
                      })
                      .reduce((acc: any, response) => {
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
        .reduce((acc, response) => {
          return { ...acc, ...response };
        }, {});
      console.log("_schemaProperties", _schemaProperties);
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
            summary: "Preview endpoint",
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
          statusResponse: {
            type: "object",
            properties: {
              code: {
                type: "string",
                example: "10000",
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

  return {
    formProvider,
    parametersFieldArray,
    requestBodyFieldArray,
    responsesFieldArray,
    schemaFieldArray,
    getValuesResponse,
    getValueSchema,
    generateOpenApiSpec,
  };
};

export default useSwaggerUI;
