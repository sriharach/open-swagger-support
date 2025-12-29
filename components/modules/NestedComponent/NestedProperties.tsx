// libs
import clsx from "clsx";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@heroui/react";

// components
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { OpenApiFormSupport, SchemaSupport } from "@/types/models/useForm";
import NestedValues from "./NestedValues";

const NestedProperties = ({
  nestIndex,
  control,
}: {
  nestIndex: number;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `schema[${nestIndex}].properties` as never,
  });
  const renderFields = fields as unknown as SchemaSupport["properties"];

  return (
    <div className="border-2 border-green-1 min-w-full rounded-md min-h-10 p-2">
      <div className="flex flex-row gap-3 items-center mb-3">
        <strong className="text-lg w-54">Properties</strong>
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
      {renderFields.map((property, propertyIndex) => {
        return (
          <div key={property.id} className="flex flex-col">
            <div className="flex flex-row gap-3 align-top space-y-6">
              <Controller
                control={control}
                name={
                  `schema.${nestIndex}.properties.${propertyIndex}.key` as never
                }
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
              <Controller
                control={control}
                name={
                  `schema.${nestIndex}.properties.${propertyIndex}.format` as never
                }
                render={({ field }) => {
                  return (
                    <div
                      className={clsx(
                        "flex w-xs gap-3 flex-1",
                        field.value !== "" ? "flex-col" : "flex-row"
                      )}
                      key={property.id?.concat(propertyIndex.toString())}
                    >
                      {field.value === "" && (
                        <Controller
                          control={control}
                          name={
                            `schema.${nestIndex}.properties.${propertyIndex}.example` as never
                          }
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
                      )}
                      <div
                        className={clsx(
                          "flex flex-row",
                          field.value !== "" ? "w-full gap-3" : "w-28"
                        )}
                      >
                        {field.value !== "" && (
                          <Controller
                            control={control}
                            name={
                              `schema.${nestIndex}.properties.${propertyIndex}.subName` as never
                            }
                            render={({ field }) => {
                              return (
                                <Input
                                  {...field}
                                  label="Sub name"
                                  variant="bordered"
                                  size="sm"
                                  className="max-w-32"
                                />
                              );
                            }}
                          />
                        )}
                        <Select
                          onSelectionChange={(value) =>
                            field.onChange(value.currentKey)
                          }
                          selectedKeys={[field.value]}
                          label="Format"
                          className="max-w-32"
                          variant="underlined"
                        >
                          <SelectItem key={""}>{"None"}</SelectItem>
                          <SelectItem key={"object"}>{"Object"}</SelectItem>
                          <SelectItem key={"array"}>{"Array"}</SelectItem>
                        </Select>
                      </div>

                      {field.value === "" ? (
                        <Controller
                          control={control}
                          name={
                            `schema.${nestIndex}.properties.${propertyIndex}.type` as never
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
                      ) : (
                        <NestedValues
                          control={control}
                          nestedSchemaIndex={nestIndex}
                          nestedPropertyIndex={propertyIndex}
                        />
                      )}
                    </div>
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
          </div>
        );
      })}
    </div>
  );
};

export default NestedProperties;
