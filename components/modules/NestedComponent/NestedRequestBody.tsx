import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { OpenApiFormSupport } from "@/types/models/useForm";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Control, Controller, useFieldArray } from "react-hook-form";

const NestedRequestBody = ({
  nestIndex,
  control,
}: {
  nestIndex: number;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `requestBody[${nestIndex}].properties` as never,
  });

  return (
    <>
      <div className="flex flex-row">
        <strong className="text-lg w-54">Request Body Properties</strong>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="max-w-30"
          onPress={() =>
            append({
              description: "",
              name: "",
              required: false,
              properties: [],
            })
          }
        >
          <PlusIcon />
        </Button>
      </div>
      {fields.map((property, propertyIndex) => {
        return (
          <div key={property.id} className="flex flex-row gap-3 items-center">
            <Controller
              control={control}
              name={
                `requestBody.${nestIndex}.properties.${propertyIndex}.key` as never
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
                `requestBody.${nestIndex}.properties.${propertyIndex}.type` as never
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
            <Controller
              control={control}
              name={
                `requestBody.${nestIndex}.properties.${propertyIndex}.example` as never
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
        );
      })}
    </>
  );
};

export default NestedRequestBody;
