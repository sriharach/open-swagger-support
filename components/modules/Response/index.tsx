// libs
import { Button, Divider, Input, Select, SelectItem } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";

// components
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";

// types
import { ResponseProps } from "./type";
import { HTTP_STATUS_CODES } from "@/constant/httpNetworkStatusCode";
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

const Response = ({ formProvider, responsesFieldArray }: ResponseProps) => {
  const formContext = useFormContext<OpenApiFormSupport>();

  return (
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
          <div key={response.id} className="flex flex-row gap-3 items-center">
            <Controller
              control={formProvider.control}
              name={`responses.${index}.code` as never}
              render={({ field }) => {
                return (
                  <div className="flex flex-row gap-3 items-center w-full">
                    <Select
                      onSelectionChange={(value) => {
                        field.onChange(value.currentKey);
                        const getMessage = HTTP_STATUS_CODES.find(
                          (x) => String(x.code) === value.currentKey,
                        );
                        if (getMessage)
                          formContext.setValue(
                            `responses.${index}.description`,
                            getMessage.message,
                          );
                      }}
                      selectedKeys={[field.value]}
                      label="Status code"
                      variant="underlined"
                      fullWidth
                    >
                      {HTTP_STATUS_CODES.map((http) => {
                        return (
                          <SelectItem key={String(http.code)}>
                            {`${http.code} ${http.message}`}
                          </SelectItem>
                        );
                      })}
                    </Select>
                    {Number(field.value) >= 400 && (
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
  );
};

export default Response;
