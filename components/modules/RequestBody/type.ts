// types
import { OpenApiFormSupport } from "@/types/models/useForm";

// libs
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

export interface RequestBodyProps {
    requestBodyFieldArray: UseFieldArrayReturn<OpenApiFormSupport, "requestBody", "id">
    formProvider: UseFormReturn<OpenApiFormSupport, any, OpenApiFormSupport>
}