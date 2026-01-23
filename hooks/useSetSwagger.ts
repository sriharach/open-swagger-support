// libs
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import yaml from "js-yaml";

// types
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

// libs
import {
  checkFormatSwagger,
  convertOpenApiToTemplate,
} from "@/libs/swagger.lib";

const useSetSwagger = (
  formProvider: UseFormReturn<OpenApiFormSupport, any, OpenApiFormSupport>,
  stringJson: string,
) => {
  useEffect(() => {
    if (!stringJson) return;
    let jsObject: Record<string, any> = {};
    try {
      jsObject = yaml.load(stringJson) as Record<string, any>;
      checkFormatSwagger(jsObject);
    } catch (error: any) {
      // Consider using a React error boundary or callback for production
      // eslint-disable-next-line no-console
      console.error("Failed to parse OpenAPI YAML/JSON:", error);
      alert(error?.message || error?.reason || "Invalid OpenAPI format");
      return;
    }
    const template = convertOpenApiToTemplate(jsObject);
    formProvider.reset(template);
  }, [stringJson, formProvider]);
};

export default useSetSwagger;
