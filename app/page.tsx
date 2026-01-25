"use client";

// libs
import {
  Divider,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Textarea,
} from "@heroui/react";
import { FormProvider } from "react-hook-form";
import MemoSwagger from "@/components/modules/MemoSwagger";
import "swagger-ui-react/swagger-ui.css";

// hooks
import useDragging from "@/hooks/useDragging";
import useSwaggerUI from "@/hooks/useSwaggerUI";

// components
import CopyIcon from "@/components/icons/CopyIcon";
import RequestBody from "@/components/modules/RequestBody";
import Parameter from "@/components/modules/Parameter";
import Response from "@/components/modules/Response";
import Schema from "@/components/modules/Schema";
import SwaggerConfigPath from "@/components/modules/SwaggerConfigPath";


export default function Home() {
  const {
    formProvider,
    parametersFieldArray,
    responsesFieldArray,
    requestBodyFieldArray,
    schemaFieldArray,
    generateOpenApiSpec,
    yamlDump,
    stringJson,
    isOpen,
    modeOfDrawer,
    onOpenChange,
    onGenerateYaml,
    onImportYaml,
    onSetTextYaml,
  } = useSwaggerUI();

  const { swaggerWidth, handleMouseDown } = useDragging();

  return (
    <section>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <DrawerContent>
          {() => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                {modeOfDrawer === "generate" ? "Yaml." : "Import yaml."}
              </DrawerHeader>
              <DrawerBody>
                {modeOfDrawer === "generate" ? (
                  <div className="flex-1 relative">
                    <pre role='textbox' className="group min-h-22 whitespace-pre-wrap break-all bg-[#262b36] text-white p-4 rounded-xl">
                      <div className="absolute hidden group-hover:block group-hover:top-2 group-hover:right-2">
                        <Button
                          size="sm"
                          isIconOnly
                          color="primary"
                          variant="ghost"
                          onPress={() => {
                            if (yamlDump) {
                              navigator.clipboard.writeText(yamlDump);
                            }
                          }}
                        >
                          <CopyIcon />
                        </Button>
                      </div>
                      {yamlDump}
                    </pre>
                  </div>
                ) : (
                  <>
                    <Textarea
                      rows={60}
                      maxRows={30}
                      value={stringJson}
                      onValueChange={onSetTextYaml}
                      classNames={{
                        inputWrapper:
                          "bg-[#262b36] data-[hover=true]:bg-[#262b36] group-data-[focus=true]:bg-[#262b36]",
                        innerWrapper: "bg-[#262b36]",
                        input: "text-md whitespace-pre-wrap",
                      }}
                    />
                  </>
                )}
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
            <SwaggerConfigPath formProvider={formProvider} />

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
            <Divider className="bg-green-1 my-6" />
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="ghost"
                color="primary"
                fullWidth
                onClick={onImportYaml}
              >
                Import swagger yaml.
              </Button>
              <Button fullWidth color="primary" onClick={onGenerateYaml}>
                Generate yaml.
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </section>
  );
}
