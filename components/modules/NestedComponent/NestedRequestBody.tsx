// libs
import {
  Control,
  Controller,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import clsx from "clsx";
import { memo } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";

// components
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

interface NestedRequestBodyProps {
  keyField: never;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
  title: string;
  level?: number;
}

const NestedRequestBody = ({
  keyField,
  control,
  title,
  level = 0,
}: NestedRequestBodyProps) => {
  const formContext = useFormContext<OpenApiFormSupport>();

  const { fields, remove, append } = useFieldArray({
    control,
    name: keyField,
  });

  return (
    <>
      <div className="flex flex-row flex-1" style={{ marginLeft: level * 14 }}>
        <strong className="text-md min-w-64">
          Request Body Properties :{" "}
          {title && <span className="text-green-1 text-md">{title}</span>} (
          {fields.length})
        </strong>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="max-w-30"
          onPress={() =>
            append({
              format: "",
              type: "string",
              key: "",
              example: "",
              isOpenChildren: true,
            })
          }
        >
          <PlusIcon />
        </Button>
      </div>
      {fields.map((property, propertyIndex) => {
        const codexName = `${keyField}.${propertyIndex}` as never;
        const getOpenChildren = formContext.watch(
          `${codexName}.isOpenChildren` as never
        ) as unknown as boolean;

        return (
          <Controller
            key={property.id}
            control={control}
            name={`${codexName}.format` as never}
            render={({ field }) => {
              return (
                <div
                  className={clsx("flex flex-col gap-1.5 ", {
                    "border-b-1 border-green-1 pb-2":
                      propertyIndex < fields.length - 1 && field.value !== "",
                  })}
                  style={{ marginLeft: level * 14 }}
                >
                  <div className="flex flex-row gap-1.5 space-y-2 items-center">
                    {field.value != "" && (
                      <Controller
                        control={control}
                        name={`${codexName}.isOpenChildren` as never}
                        render={({ field }) => {
                          return (
                            <i
                              className={clsx("cursor-pointer transition-all", {
                                "rotate-90 hover:-rotate-90": field.value,
                                "-rotate-90 hover:rotate-90": !field.value,
                              })}
                            >
                              <ArrowRightIcon
                                onClick={() => field.onChange(!field.value)}
                                className="size-5 text-green-1"
                              />
                            </i>
                          );
                        }}
                      />
                    )}

                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      variant="light"
                      onPress={() => remove(propertyIndex)}
                    >
                      <TrashIcon />
                    </Button>

                    <Select
                      onSelectionChange={(value) => {
                        field.onChange(value.currentKey);
                        formContext.resetField(`${codexName}.key` as never);
                        formContext.resetField(`${codexName}.type` as never);
                        formContext.resetField(`${codexName}.example` as never);
                      }}
                      selectedKeys={[field.value]}
                      label="Format"
                      className="max-w-32"
                      variant="underlined"
                    >
                      <SelectItem key={""}>{"None"}</SelectItem>
                      <SelectItem key={"object"}>{"Object"}</SelectItem>
                      <SelectItem key={"array"}>{"Array"}</SelectItem>
                    </Select>

                    <Controller
                      control={control}
                      name={`${codexName}.key` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Name"
                            variant="bordered"
                            size="sm"
                            className="max-w-32"
                          />
                        );
                      }}
                    />

                    {field.value === "" && (
                      <>
                        <Controller
                          control={control}
                          name={`${codexName}.type` as never}
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
                                <SelectItem key={"string"}>
                                  {"String"}
                                </SelectItem>
                                <SelectItem key={"number"}>
                                  {"Number"}
                                </SelectItem>
                                <SelectItem key={"boolean"}>
                                  {"Boolean"}
                                </SelectItem>
                              </Select>
                            );
                          }}
                        />
                        <Controller
                          control={control}
                          name={`${codexName}.example` as never}
                          render={({ field }) => {
                            return (
                              <Input
                                {...field}
                                label="Example"
                                variant="bordered"
                                size="sm"
                                className="max-w-32"
                              />
                            );
                          }}
                        />
                      </>
                    )}
                  </div>
                  {field.value !== "" && getOpenChildren && (
                    <NestedRequestBody
                      title={
                        formContext.watch(
                          `${codexName}.key` as never
                        ) as unknown as string
                      }
                      keyField={`${codexName}.properties` as never}
                      control={control}
                      level={level + 1}
                    />
                  )}
                </div>
              );
            }}
          />
        );
      })}
    </>
  );
};

export default memo(NestedRequestBody);
