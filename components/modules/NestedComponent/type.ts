import { Control } from "react-hook-form";
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";

export interface NestedComponentLevel {
  level?: number;
}

export interface NestedComponentTitleControl {
  title: string;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
}

export interface NestedPropertiesProps
  extends NestedComponentLevel,
    NestedComponentTitleControl {
  keyField: never;
}

export interface NestedRequestBodyProps
  extends NestedComponentLevel,
    NestedComponentTitleControl {
  keyField: never;
}
