"use client";

// libs
import {
  Input,
  Select,
  SelectItem,
  Divider,
  Button,
  Checkbox,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";
import { FormProvider, Controller } from "react-hook-form";
import MemoSwagger from "@/components/modules/MemoSwagger";
import "swagger-ui-react/swagger-ui.css";

// configs
import apiQuality from "@/constant/api-quality";

// hooks
import useDragging from "@/hooks/useDragging";
import useSwaggerUI from "@/hooks/useSwaggerUI";

// components
import CopyIcon from "@/components/icons/CopyIcon";
import RequestBody from "@/components/modules/RequestBody";
import Parameter from "@/components/modules/Parameter";
import Response from "@/components/modules/Response";
import Schema from "@/components/modules/Schema";

export default function Home() {
  const {
    formProvider,
    parametersFieldArray,
    responsesFieldArray,
    requestBodyFieldArray,
    schemaFieldArray,
    generateOpenApiSpec,
    yamlDump,
    isOpen,
    onOpenChange,
    handleGenerateYaml,
  } = useSwaggerUI();

  const { swaggerWidth, handleMouseDown } = useDragging();

  return (
    <section>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Yaml.</DrawerHeader>
              <DrawerBody>
                <div className="flex items-center mb-2">
                  <Button
                    size="sm"
                    isIconOnly
                    variant="solid"
                    onPress={() => {
                      if (yamlDump) {
                        navigator.clipboard.writeText(yamlDump);
                      }
                    }}
                  >
                    <CopyIcon />
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap break-all bg-[#262b36] text-white p-4 rounded-xl">
                  {yamlDump}
                </pre>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>

      <FormProvider {...formProvider}>
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: `${swaggerWidth}px 2px 1fr` }}
        >
          <div
            id="swagger-support"
            className="p-4 border-r-2 border-green-3 overflow-y-auto h-screen"
            style={{ width: swaggerWidth }}
          >
            <h2 className="font-bold text-2xl">Swagger Support</h2>
            <MemoSwagger spec={generateOpenApiSpec as never} />
          </div>

          {/* Draggable divider */}
          <div
            className="border-green-3 cursor-col-resize z-10 w-1"
            onMouseDown={handleMouseDown}
          />

          <div className="flex flex-col space-y-3 p-4 overflow-y-auto h-screen">
            <div id="api-path" className="flex flex-col space-y-3">
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
                        label="Api path"
                        variant="bordered"
                        size="sm"
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Request Body */}
            <RequestBody
              requestBodyFieldArray={requestBodyFieldArray}
              formProvider={formProvider}
            />

            {/* Parameter */}
            <Parameter
              parametersFieldArray={parametersFieldArray}
              formProvider={formProvider}
            />

            {/* Response */}
            <Response
              responsesFieldArray={responsesFieldArray}
              formProvider={formProvider}
            />

            {/* Schema */}
            <Schema
              schemaFieldArray={schemaFieldArray}
              formProvider={formProvider}
            />
            <div className="flex-1">
              <Button fullWidth onClick={handleGenerateYaml}>
                Generate yaml.
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </section>
  );
}
