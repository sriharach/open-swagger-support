// libs
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

// types
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

export interface ParameterProps {
    parametersFieldArray: UseFieldArrayReturn<OpenApiFormSupport, "parameters", "id">
    formProvider: UseFormReturn<OpenApiFormSupport, any, OpenApiFormSupport>
}