import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { OpenApiFormSupport } from "@/types/models/useForm";
import { Button, Divider, Input, Select, SelectItem } from "@heroui/react";
import { Control, Controller, useFieldArray } from "react-hook-form";

const NestedValues = ({
  nestedPropertyIndex,
  nestedSchemaIndex,
  control,
}: {
  nestedPropertyIndex: number;
  nestedSchemaIndex: number;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `schema[${nestedSchemaIndex}].properties[${nestedPropertyIndex}].properties` as never,
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
              key: "",
              format: "",
            })
          }
        >
          <PlusIcon />
        </Button>
      </div>
      {fields.map((component, componentIndex) => {
        return (
          <div key={component.id} className="flex flex-row gap-3 items-center">
            <Controller
              control={control}
              name={
                `schema.${nestedSchemaIndex}.properties.${nestedPropertyIndex}.properties.${componentIndex}.key` as never
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
                `schema.${nestedSchemaIndex}.properties.${nestedPropertyIndex}.properties.${componentIndex}.example` as never
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
            <Controller
              control={control}
              name={
                `schema.${nestedSchemaIndex}.properties.${nestedPropertyIndex}.properties.${componentIndex}.type` as never
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
      {/* {fields.length > 0 && <Divider className="bg-green-1 my-4" />} */}
    </div>
  );
};

export default NestedValues;
