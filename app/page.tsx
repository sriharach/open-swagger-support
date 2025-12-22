"use client";

// libs
import { memo, useMemo } from "react";
import {
  Input,
  Select,
  SelectItem,
  Divider,
  Button,
  Checkbox,
  CheckboxGroup,
} from "@heroui/react";
import SwaggerUI from "swagger-ui-react";
import yaml from "js-yaml";
import {
  FormProvider,
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import "swagger-ui-react/swagger-ui.css";

// configs
import apiQuality from "@/constant/api-quality";
import mockSwagger from "@/constant/mock.json";

// types
import { type UseFormOpenApi } from "@/types/models/useForm";
import apiTypes, { formatTypes, mapSchemaTypes } from "@/constant/api-type";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";

export default function Home() {
  const formProvider = useForm<UseFormOpenApi>({
    defaultValues: {
      responses: [
        {
          code: "200",
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
            },
          ],
        },
      ],
    },
  });
  const { control, getValues, watch, formState } = formProvider;

  const parametersFieldArray = useFieldArray({
    control: control,
    name: "parameters",
  });

  const responsesFieldArray = useFieldArray({
    control: control,
    name: "responses",
  });

  const schemaFieldArray = useFieldArray({
    control: control,
    name: "schema",
  });

  const watchApiPath = watch("apiPath");
  const watchMethod = watch("method");
  const watchApiName = watch("name");
  const watchParameters = watch("parameters");
  const watchResponses = watch("responses");

  const getValueSchema = getValues("schema");
  const getValuesResponse = getValues("responses");

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

    const responses = watchResponses
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
      }, {});

    let refData: Record<string, any> = {};
    let schemaProperties: Record<string, any> = {};

    if (getValueSchema.length > 0) {
      schemaProperties = getValueSchema.map((c_schema) => {
        const checkResponseCode = watchResponses.some(
          (x) => x.code === c_schema.code
        );
        if (checkResponseCode) {
          return c_schema.properties
            .map((proper) => {
              if (proper.format === "object") {
                return {
                  [proper.key]: {
                    type: "object",
                    properties: proper.components
                      .map((compo) => {
                        return {
                          [compo.name]: {
                            type: compo.type,
                            example: compo.example,
                          },
                        };
                      })
                      .reduce((acc, response) => {
                        return { ...acc, ...response };
                      }, {}),
                  },
                };
              } else {
                return {
                  [proper.key]: {
                    type: "array",
                    items: {
                      properties: proper.components
                        .map((compo) => {
                          return {
                            [compo.name]: {
                              type: compo.type,
                              example: compo.example,
                            },
                          };
                        })
                        .reduce((acc, response) => {
                          return { ...acc, ...response };
                        }, {}),
                    },
                  },
                };
              }
            })
            .reduce((acc: any, response) => {
              return { ...acc, ...response };
            }, {});
        }
        return [];
      });
    }

    if (schemaProperties[0] && Object.keys(schemaProperties[0]).length > 0) {
      refData = Object.keys(schemaProperties[0])
        .map((key) => {
          return {
            [key]: {
              $ref: `#/components/schemas/${key}`,
            },
          };
        })
        .reduce((acc, response) => {
          return { ...acc, ...response };
        }, {});
    }

    return {
      openapi: "3.0.0",
      info: { title: "Swagger Support Spec", description: "", version: "1.0.0" },
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
            responses: responses,
          },
        },
      },
      components: {
        schemas: {
          [watchApiName]: {
            type: "object",
            properties: {
              status: {
                $ref: "#/components/schemas/StatusResponse",
              },
              data: {
                type: "object",
                properties: {
                  ...refData,
                },
              },
            },
          },
          ...schemaProperties[0],
          StatusResponse: {
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
  ]);

  const onSubmit = () => {
    const yamlDump = yaml.dump(generateOpenApiSpec);
    console.log("yamlDump :>> ", yamlDump);
  };

  const MemoSwagger = memo((props: { spec: string }) => {
    // console.log("props :>> ", props.spec);
    return SwaggerUI({ spec: props.spec });
  });

  const NestedComponent = ({
    nestedPropertyIndex,
    nestedSchemaIndex,
  }: {
    nestedPropertyIndex: number;
    nestedSchemaIndex: number;
  }) => {
    const { fields, remove, append } = useFieldArray({
      control,
      name: `schema[${nestedSchemaIndex}].properties[${nestedPropertyIndex}].components` as never,
    });
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-row gap-3 items-center">
          <strong className="text-lg w-54">Properties Value</strong>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="max-w-30"
            onPress={() =>
              append({
                value: "",
              })
            }
          >
            <PlusIcon />
          </Button>
        </div>
        {fields.map((component, componentIndex) => {
          return (
            <div
              key={component.id}
              className="flex flex-row gap-3 items-center"
            >
              <Controller
                control={control}
                name={
                  `schema.${nestedSchemaIndex}.properties.${nestedPropertyIndex}.components.${componentIndex}.name` as never
                }
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      label="Name"
                      variant="bordered"
                      size="sm"
                      className="max-w-60"
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name={
                  `schema.${nestedSchemaIndex}.properties.${nestedPropertyIndex}.components.${componentIndex}.example` as never
                }
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      label="example"
                      variant="bordered"
                      size="sm"
                      className="max-w-60"
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name={
                  `schema.${nestedSchemaIndex}.properties.${nestedPropertyIndex}.components.${componentIndex}.type` as never
                }
                render={({ field }) => {
                  return (
                    <Select
                      onSelectionChange={(value) =>
                        field.onChange(value.currentKey)
                      }
                      selectedKeys={[field.value]}
                      label="Type"
                      className="max-w-32"
                      variant="underlined"
                    >
                      <SelectItem key={"string"}>{"String"}</SelectItem>
                      <SelectItem key={"number"}>{"Number"}</SelectItem>
                      <SelectItem key={"boolean"}>{"Boolean"}</SelectItem>
                    </Select>
                  );
                }}
              />
              <Button
                isIconOnly
                color="danger"
                size="sm"
                variant="light"
                onPress={() => remove(componentIndex)}
              >
                <TrashIcon />
              </Button>
            </div>
          );
        })}
        {fields.length > 0 && <Divider className="bg-green-1 my-4" />}
      </div>
    );
  };

  const NestedProperty = ({ nestIndex }: { nestIndex: number }) => {
    const { fields, remove, append } = useFieldArray({
      control,
      name: `schema[${nestIndex}].properties` as never,
    });

    return (
      <div className="border-2 border-green-1 min-w-full rounded-md min-h-10 p-2">
        <div className="flex flex-row gap-3 items-center">
          <strong className="text-lg w-54">Properties Schema</strong>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="max-w-30"
            onPress={() =>
              append({
                key: "",
                format: "",
              })
            }
          >
            <PlusIcon />
          </Button>
        </div>
        {fields.map((property, propertyIndex) => {
          return (
            <div key={property.id} className="flex flex-col gap-3">
              <div className="flex flex-row gap-3 items-center">
                <Controller
                  control={control}
                  name={
                    `schema.${nestIndex}.properties.${propertyIndex}.key` as never
                  }
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        label="Key schema"
                        variant="bordered"
                        size="sm"
                        className="max-w-60"
                      />
                    );
                  }}
                />
                <Controller
                  control={control}
                  name={
                    `schema.${nestIndex}.properties.${propertyIndex}.format` as never
                  }
                  render={({ field }) => {
                    return (
                      <Select
                        onSelectionChange={(value) =>
                          field.onChange(value.currentKey)
                        }
                        selectedKeys={[field.value]}
                        label="Format"
                        className="max-w-32"
                        variant="underlined"
                      >
                        <SelectItem key={"object"}>{"Object"}</SelectItem>
                        <SelectItem key={"array"}>{"Array"}</SelectItem>
                      </Select>
                    );
                  }}
                />
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => remove(propertyIndex)}
                >
                  <TrashIcon />
                </Button>
              </div>
              <NestedComponent
                nestedSchemaIndex={nestIndex}
                nestedPropertyIndex={propertyIndex}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section>
      <FormProvider {...formProvider}>
        <div className="grid grid-cols-[1fr_560px] lg:grid-cols-[1fr_960px] min-h-screen">
          <div className="p-4 border-r-1.5 border-green-3">
            <h2 className="font-bold text-2xl">Swagger Support</h2>
            <MemoSwagger spec={generateOpenApiSpec as never} />
            {/* <SwaggerUI spec={mockSwagger} /> */}
          </div>

          <div id="api-path" className="flex flex-col space-y-3 p-4">
            <div className="flex flex-col space-y-3">
              <h2 className="font-bold text-2xl">Api path/name</h2>
              <Divider className="bg-green-1" />
              <Controller
                control={control}
                name="name"
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      label="Name"
                      variant="bordered"
                      size="sm"
                    />
                  );
                }}
              />

              <div className="flex justify-between gap-3">
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => {
                    return (
                      <Select
                        onSelectionChange={(value) =>
                          field.onChange(value.currentKey)
                        }
                        selectedKeys={[field.value]}
                        label="Method"
                        className="max-w-32"
                        variant="underlined"
                      >
                        {apiQuality.map((api) => (
                          <SelectItem key={api.path}>{api.name}</SelectItem>
                        ))}
                      </Select>
                    );
                  }}
                />
                <Controller
                  control={control}
                  name="apiPath"
                  render={({ field }) => {
                    return (
                      <Input
                        {...field}
                        label="api path"
                        variant="bordered"
                        size="sm"
                      />
                    );
                  }}
                />
              </div>
            </div>
            <div id="parameter" className="flex flex-col space-y-3">
              <div className="flex flex-row gap-3 items-center">
                <h2 className="font-bold text-2xl w-32">Parameter</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="max-w-30"
                  onPress={() =>
                    parametersFieldArray.append({
                      name: "",
                      in: "",
                      required: false,
                      schema: { type: "", enum: [] },
                    })
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
              <Divider className="bg-green-1" />
              {parametersFieldArray.fields.map((parameter, index) => {
                return (
                  <div
                    key={parameter.id}
                    className="flex flex-row gap-3 items-center"
                  >
                    <Controller
                      name={`parameters.${index}.required` as never}
                      control={control}
                      render={({ field }) => {
                        return (
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              Required Field
                            </p>
                            <Checkbox
                              onValueChange={(value) => field.onChange(value)}
                            />
                          </div>
                        );
                      }}
                    />
                    <Controller
                      name={`parameters.${index}.name` as never}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Name"
                            variant="bordered"
                            size="sm"
                            className="max-w-60"
                          />
                        );
                      }}
                    />
                    <Controller
                      name={`parameters.${index}.in` as never}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Select
                            onSelectionChange={(value) =>
                              field.onChange(value.currentKey)
                            }
                            selectedKeys={[field.value]}
                            label="In"
                            className="max-w-32"
                            variant="underlined"
                          >
                            {apiTypes.map((apiType) => (
                              <SelectItem key={apiType}>{apiType}</SelectItem>
                            ))}
                          </Select>
                        );
                      }}
                    />
                    <Controller
                      name={`parameters.${index}.format` as never}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Select
                            onSelectionChange={(value) =>
                              field.onChange(value.currentKey)
                            }
                            selectedKeys={[field.value]}
                            label="Type"
                            className="max-w-32"
                            variant="underlined"
                          >
                            {formatTypes.map((formatType) => (
                              <SelectItem key={formatType}>
                                {formatType}
                              </SelectItem>
                            ))}
                          </Select>
                        );
                      }}
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => parametersFieldArray.remove(index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Response */}
            <div id="response" className="flex flex-col space-y-3">
              <div className="flex flex-row gap-3 items-center">
                <h2 className="font-bold text-2xl w-32">Responses</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="max-w-30"
                  onPress={() =>
                    responsesFieldArray.append({
                      code: "",
                      description: "",
                    })
                  }
                >
                  <PlusIcon />
                </Button>
              </div>

              <Divider className="bg-green-1" />
              {responsesFieldArray.fields.map((response, index) => {
                return (
                  <div
                    key={response.id}
                    className="flex flex-row gap-3 items-center"
                  >
                    <Controller
                      control={control}
                      name={`responses.${index}.code` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Status code"
                            variant="bordered"
                            size="sm"
                            className="max-w-60"
                          />
                        );
                      }}
                    />
                    <Controller
                      control={control}
                      name={`responses.${index}.description` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Description"
                            variant="bordered"
                            size="sm"
                            className="max-w-60"
                          />
                        );
                      }}
                    />
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => responsesFieldArray.remove(index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* schema */}
            <div id="schema" className="flex flex-col space-y-3">
              <div className="flex flex-row gap-3 items-center">
                <h2 className="font-bold text-2xl w-32">Schema</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="max-w-30"
                  onPress={() =>
                    schemaFieldArray.append({
                      code: "",
                      properties: [{ key: "", format: "", components: [] }],
                    })
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
              <Divider className="bg-green-1" />
              {schemaFieldArray.fields.map((schema, index) => {
                return (
                  <div key={schema.id} className="flex flex-col space-y-4">
                    <div className="flex flex-row gap-3 w-full items-center">
                      <Controller
                        control={control}
                        name={`schema.${index}.code` as never}
                        render={({ field }) => {
                          return (
                            <Select
                              onSelectionChange={(value) =>
                                field.onChange(value.currentKey)
                              }
                              selectedKeys={[field.value]}
                              label="Code ref."
                              className="max-w-32"
                              variant="underlined"
                            >
                              {getValuesResponse.map((response) => (
                                <SelectItem key={response.code}>
                                  {response.code}
                                </SelectItem>
                              ))}
                            </Select>
                          );
                        }}
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => schemaFieldArray.remove(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                    {/* Properties Schema */}
                    <NestedProperty nestIndex={index} />
                  </div>
                );
              })}
            </div>
            <Button onClick={onSubmit}>Generate yaml.</Button>
          </div>
        </div>
      </FormProvider>
    </section>
  );
}
