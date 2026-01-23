// libs
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

// types
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

export interface ResponseProps {
    responsesFieldArray: UseFieldArrayReturn<OpenApiFormSupport, "responses", "id">
    formProvider: UseFormReturn<OpenApiFormSupport, any, OpenApiFormSupport>
}