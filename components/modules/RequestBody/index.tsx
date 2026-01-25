// libs
import { Button, Checkbox, Divider, Input } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";
import clsx from "clsx";

// components
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import NestedComponent from "../NestedComponent";

// types
import { RequestBodyProps } from "./type";
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";


const RequestBody = ({
  requestBodyFieldArray,
  formProvider,
}: RequestBodyProps) => {
  const formContext = useFormContext<OpenApiFormSupport>();
  return (
    <>
      <div id="request-body" className="flex flex-col space-y-3">
        <div className="flex flex-row gap-3 items-center">
          <h2 className="font-bold text-2xl w-42">Request Body</h2>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="max-w-30"
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
            <div
              key={body.id}
              className={clsx("flex flex-col gap-3 align-top", {
                "border-b-2 border-dotted border-green-1 pb-2":
                  index < requestBodyFieldArray.fields.length - 1,
              })}
            >
              <div className="flex flex-row gap-3 items-center flex-1">
                <Controller
                  name={`requestBody.${index}.required` as never}
                  control={formProvider.control}
                  render={({ field }) => {
                    return (
                      <div className="text-center">
                        <p className="text-xs font-medium">Required Field</p>
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
              <NestedComponent
                fieldProperties={{
                  showSwapIcon: true,
                  title: "Body Properties",
                  keyTitle: formContext.watch(`requestBody.${index}.name`),
                }}
                formFieldArray={{
                  control: formProvider.control,
                  name: `requestBody.${index}.properties`,
                }}
                internalFunction={{
                  appendField: {
                    format: "",
                    type: "string",
                    key: "",
                    example: "",
                    isOpenChildren: true,
                  },
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RequestBody;
