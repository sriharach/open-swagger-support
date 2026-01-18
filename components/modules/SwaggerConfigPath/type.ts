// libs
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

// types
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

export interface SwaggerConfigPathProps {
//   schemaFieldArray: UseFieldArrayReturn<OpenApiFormSupport, "schema", "id">;
  formProvider: UseFormReturn<OpenApiFormSupport, any, OpenApiFormSupport>;
}