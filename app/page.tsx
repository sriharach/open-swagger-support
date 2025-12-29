"use client";

// libs
import {
  Input,
  Select,
  SelectItem,
  Divider,
  Button,
  Checkbox,
} from "@heroui/react";
import yaml from "js-yaml";
import { FormProvider, Controller } from "react-hook-form";
import MemoSwagger from "@/components/modules/MemoSwagger";
import "swagger-ui-react/swagger-ui.css";
import React, { useRef, useState } from "react";

// configs
import apiQuality from "@/constant/api-quality";
import mockSwagger from "@/constant/mock.json";

// types
import apiTypes, { formatTypes } from "@/constant/api-type";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import useSwaggerUI from "@/hooks/useSwaggerUI";
import NestedProperties from "@/components/modules/NestedComponent/NestedProperties";
import NestedRequestBody from "@/components/modules/NestedComponent/NestedRequestBody";

export default function Home() {
  const {
    formProvider,
    parametersFieldArray,
    responsesFieldArray,
    requestBodyFieldArray,
    schemaFieldArray,
    getValuesResponse,
    generateOpenApiSpec,
  } = useSwaggerUI();

  const onSubmit = () => {
    const yamlDump = yaml.dump(generateOpenApiSpec);
    console.log("yamlDump :>> ", yamlDump);
  };

  const [swaggerWidth, setSwaggerWidth] = useState(600); // initial width
  const dragging = useRef(false);

  // Mouse event handlers
  const handleMouseDown = () => {
    dragging.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging.current) {
      setSwaggerWidth(Math.max(200, e.clientX)); // minimum width 200px
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
    document.body.style.cursor = "";
  };

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <section>
      <FormProvider {...formProvider}>
        <div
          className="grid"
          style={{ gridTemplateColumns: `${swaggerWidth}px 2px 1fr` }}
        >
          <div
            id="swagger-support"
            className="p-4 border-r-2 border-green-3 overflow-y-auto h-screen"
            style={{ width: swaggerWidth }}
          >
            <h2 className="font-bold text-2xl">Swagger Support</h2>
            <MemoSwagger spec={generateOpenApiSpec as never} />
            {/* <SwaggerUI spec={mockSwagger} /> */}
          </div>
          {/* Draggable divider */}
          <div
            className="border-green-3 cursor-col-resize z-10 w-1"
            onMouseDown={handleMouseDown}
          />
          <div
            id="api-path"
            className="flex flex-col space-y-3 p-4 overflow-y-auto h-screen"
          >
            <div className="flex flex-col space-y-3">
              <h2 className="font-bold text-2xl">Api path/name</h2>
              <Divider className="bg-green-1" />
              <Controller
                control={formProvider.control}
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
                  control={formProvider.control}
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
                  control={formProvider.control}
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

            {/* Request Body */}
            <div id="request-body" className="flex flex-col space-y-3">
              <div className="flex flex-row gap-3 items-center">
                <h2 className="font-bold text-2xl w-42">Request Body</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="max-w-30"
                  isDisabled={requestBodyFieldArray.fields.length >= 1}
                  onPress={() =>
                    requestBodyFieldArray.append({
                      name: "",
                      properties: [],
                      required: false,
                    })
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
              <Divider className="bg-green-1" />
              {requestBodyFieldArray.fields.map((body, index) => {
                return (
                  <div key={body.id} className="flex flex-col gap-3 align-top">
                    <div className="flex flex-row gap-3 items-center flex-1">
                      <Controller
                        name={`requestBody.${index}.required` as never}
                        control={formProvider.control}
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
                        name={`requestBody.${index}.name` as never}
                        control={formProvider.control}
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
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => requestBodyFieldArray.remove(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                    <NestedRequestBody
                      nestIndex={index}
                      control={formProvider.control}
                    />
                  </div>
                );
              })}
            </div>

            {/* Parameter */}
            <div id="parameter" className="flex flex-col space-y-3">
              <div className="flex flex-row gap-3 items-center">
                <h2 className="font-bold text-2xl w-42">Parameter</h2>
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
                      control={formProvider.control}
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
                      control={formProvider.control}
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
                      control={formProvider.control}
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
                      control={formProvider.control}
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
                <h2 className="font-bold text-2xl w-42">Responses</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="max-w-30"
                  onPress={() =>
                    responsesFieldArray.append({
                      code: "",
                      description: "",
                      name: "",
                      codeResponse: "",
                      message: "",
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
                      control={formProvider.control}
                      name={`responses.${index}.code` as never}
                      render={({ field }) => {
                        return (
                          <div className="flex flex-row gap-3 items-center shrink">
                            <Input
                              {...field}
                              label="Status code"
                              variant="bordered"
                              size="sm"
                              className="max-w-40"
                            />
                            {String(field.value) >= "400" && (
                              <Controller
                                control={formProvider.control}
                                name={`responses.${index}.message` as never}
                                render={({ field }) => {
                                  return (
                                    <Input
                                      {...field}
                                      label="Message"
                                      variant="bordered"
                                      size="sm"
                                      className="max-w-40"
                                    />
                                  );
                                }}
                              />
                            )}
                          </div>
                        );
                      }}
                    />
                    <Controller
                      control={formProvider.control}
                      name={`responses.${index}.name` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Name"
                            variant="bordered"
                            size="sm"
                            className="max-w-40"
                          />
                        );
                      }}
                    />
                    <Controller
                      control={formProvider.control}
                      name={`responses.${index}.description` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Description"
                            variant="bordered"
                            size="sm"
                            className="max-w-40"
                          />
                        );
                      }}
                    />
                    <Controller
                      control={formProvider.control}
                      name={`responses.${index}.codeResponse` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Code response"
                            variant="bordered"
                            size="sm"
                            className="max-w-40"
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

            {/* Schema */}
            <div id="schema" className="flex flex-col space-y-3">
              <div className="flex flex-row gap-3 items-center">
                <h2 className="font-bold text-2xl w-42">Schema</h2>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="max-w-30"
                  // isDisabled={
                  //   schemaFieldArray.fields.length >= getValuesResponse.length
                  // }
                  isDisabled
                  onPress={() =>
                    schemaFieldArray.append({
                      code: "",
                      properties: [
                        {
                          key: "",
                          format: "",
                          properties: [],
                          type: "string",
                        },
                      ],
                    })
                  }
                >
                  <PlusIcon />
                </Button>
              </div>
              <Divider className="bg-green-1" />
              {schemaFieldArray.fields.map((schema, index) => {
                // Collect all selected codes except the current one
                // Exclude the current schema's code from the selected codes
                // const selectedCodes = schemaFieldArray.fields
                //   .filter((_, i) => i !== index)
                //   .map((s) => s.code);

                // const availableResponses = getValuesResponse.filter(
                //   (response) => !selectedCodes.includes(response.code)
                // );
                return (
                  <div key={schema.id} className="flex flex-col space-y-4">
                    <div className="flex flex-row gap-3 w-full items-center">
                      <Controller
                        control={formProvider.control}
                        name={`schema.${index}.code` as never}
                        render={({ field }) => {
                          return (
                            <Select
                              isDisabled
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
                      {/* <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => schemaFieldArray.remove(index)}
                      >
                        <TrashIcon />
                      </Button> */}
                    </div>
                    {/* Properties Schema */}
                    <NestedProperties
                      control={formProvider.control}
                      nestIndex={index}
                    />
                  </div>
                );
              })}
              <Button onClick={onSubmit}>Generate yaml.</Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </section>
  );
}
