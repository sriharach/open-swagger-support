// libs
import { Controller } from "react-hook-form";
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  RadioGroup,
} from "@heroui/react";

// components
import PlusIcon from "@/components/icons/PlusIcon";
import apiTypes, { formatTypes } from "@/constant/api-type";
import TrashIcon from "@/components/icons/TrashIcon";
import Radio from "@/components/Radio";

// types
import { ParameterProps } from "./type";
import clsx from "clsx";

const Parameter = ({ parametersFieldArray, formProvider }: ParameterProps) => {
  return (
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
              name: "Parameter Name",
              in: "query",
              required: false,
              format: "string",
              enum: "",
              default: "",
            })
          }
        >
          <PlusIcon />
        </Button>
      </div>
      <Divider className="bg-green-1" />
      {parametersFieldArray.fields.map((parameter, index) => {
        return (
          <div key={parameter.id} className="flex flex-col space-y-3">
            <div className="flex flex-row gap-3 items-center">
              <Controller
                name={`parameters.${index}.required` as never}
                control={formProvider.control}
                render={({ field }) => {
                  return (
                    <div className="text-center">
                      <p className="text-sm font-medium">Required Field</p>
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
                        <SelectItem key={apiType.value}>
                          {apiType.label}
                        </SelectItem>
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
                        <SelectItem key={formatType.value}>
                          {formatType.label}
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
            <Controller
              control={formProvider.control}
              name={`parameters.${index}.radioKey` as never}
              render={({ field }) => {
                return (
                  <RadioGroup value={field.value}>
                    <div
                      className={clsx(
                        "group inline-flex items-center cursor-pointer",
                        "max-w-75 rounded-lg border-2",
                        field.value === "1"
                          ? "border-green-1 py-2"
                          : "border-green-5"
                      )}
                      onClick={() => {
                        field.onChange("1");
                        formProvider.resetField(
                          `parameters.${index}.default` as never
                        );
                      }}
                    >
                      <Radio value="1" />
                      <div className="flex flex-col gap-3">
                        <strong className="text-sm">Add default</strong>
                        {field.value == 1 && (
                          <Controller
                            name={`parameters.${index}.default` as never}
                            control={formProvider.control}
                            render={({ field }) => {
                              return (
                                <Input
                                  {...field}
                                  label="Default"
                                  variant="bordered"
                                  size="sm"
                                  className="max-w-60"
                                />
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className={clsx(
                        "group inline-flex  items-center cursor-pointer",
                        "max-w-75 rounded-lg border-2",
                        field.value === "2"
                          ? "border-green-1 py-2"
                          : "border-green-5"
                      )}
                      onClick={() => {
                        field.onChange("2");
                        formProvider.resetField(
                          `parameters.${index}.enum` as never
                        );
                      }}
                    >
                      <Radio value="2" />
                      <div className="flex flex-col gap-3">
                        <strong className="text-sm">Add enum</strong>
                        {field.value == 2 && (
                          <Controller
                            name={`parameters.${index}.enum` as never}
                            control={formProvider.control}
                            render={({ field }) => {
                              return (
                                <Input
                                  {...field}
                                  label="Enum (comma separated)"
                                  variant="bordered"
                                  size="sm"
                                  className="max-w-60"
                                />
                              );
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Parameter;
