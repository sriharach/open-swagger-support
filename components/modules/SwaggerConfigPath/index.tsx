// libs
import { Controller } from "react-hook-form";
import { Divider, Input, Select, SelectItem } from "@heroui/react";

// components
import apiQuality from "@/constant/api-quality";
import { SwaggerConfigPathProps } from "./type";

const SwaggerConfigPath = ({ formProvider }: SwaggerConfigPathProps) => {
  return (
    <div id="api-path" className="flex flex-col space-y-3">
      <h2 className="font-bold text-2xl">Config title</h2>
      <Divider className="bg-green-1" />
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={formProvider.control}
          name='info.title'
          render={({ field }) => {
            return (
              <Input
                {...field}
                label="Title swagger"
                variant="bordered"
                size="sm"
              />
            );
          }}
        />
        <Controller
          control={formProvider.control}
          name="tagName"
          render={({ field }) => {
            return (
              <Input {...field} label="Tag name" variant="bordered" size="sm" />
            );
          }}
        />
      </div>

      <div className="flex justify-between gap-3">
        <Controller
          control={formProvider.control}
          name="method"
          render={({ field }) => {
            return (
              <Select
                onSelectionChange={(value) => field.onChange(value.currentKey)}
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
          name="baseSchemaName"
          render={({ field }) => {
            return (
              <Input
                {...field}
                label="Base schema name"
                variant="bordered"
                size="sm"
              />
            );
          }}
        />
      </div>
      <Controller
        control={formProvider.control}
        name="apiPath"
        render={({ field }) => {
          return (
            <Input {...field} label="Api path" variant="bordered" size="sm" />
          );
        }}
      />
    </div>
  );
};

export default SwaggerConfigPath;
