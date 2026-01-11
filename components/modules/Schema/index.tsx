// libs
import { Divider, Input } from "@heroui/react";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";

// components
import NestedProperties from "../NestedComponent/NestedProperties";

// types
import { SchemaProps } from "./type";
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

const Schema = ({ schemaFieldArray, formProvider }: SchemaProps) => {
  const getResponseValues = useWatch({
    control: formProvider.control,
    name: "responses",
  });
  const formContext = useFormContext<OpenApiFormSupport>();

  useEffect(() => {
    if (getResponseValues.length > 0) {
      formContext.setValue(
        `schema.0.code` as never,
        getResponseValues[0].code as never
      );
    }
  }, [getResponseValues]);

  return (
    <div id="schema" className="flex flex-col space-y-3">
      <div className="flex flex-row gap-3 items-center">
        <h2 className="font-bold text-2xl w-42">Schema</h2>
        {/* <Button
          isIconOnly
          variant="light"
          size="sm"
          className="max-w-30"
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
        </Button> */}
      </div>
      <Divider className="bg-green-1" />
      {schemaFieldArray.fields.map((schema, index) => {
        return (
          <div key={schema.id} className="flex flex-col space-y-4">
            <div className="flex flex-row gap-3 w-full items-center">
              <Controller
                control={formProvider.control}
                name={`schema.${index}.code` as never}
                render={({ field }) => {
                  return (
                    <Input
                      {...field}
                      readOnly
                      label="Code ref."
                      variant="bordered"
                      size="sm"
                      className="max-w-20"
                    />
                  );
                }}
              />
            </div>
            {/* Properties Schema */}
            <NestedProperties
              control={formProvider.control}
              nestIndex={index}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Schema;
