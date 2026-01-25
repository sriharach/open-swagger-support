import {
  Control,
  FieldArray,
  FieldArrayPath,
  UseFieldArrayAppend,
  UseFieldArrayProps,
} from "react-hook-form";
import { OpenApiFormSupport } from "@/types/models/useForm-interface.model";
import { apiFormatSchema } from "@/constant/api-type";

export interface NestedComponentLevel {
  level?: number;
}

export interface NestedComponentTitleControl {
  title: string;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
}

export interface NestedPropertiesProps
  extends NestedComponentLevel, NestedComponentTitleControl {
  keyField: never;
}

export interface NestedRequestBodyProps
  extends NestedComponentLevel, NestedComponentTitleControl {
  keyField: never;
  formatSchemaTypes?: apiFormatSchema[];
}

export type FieldValues = Record<string, any>;

export interface NestedComponentFields<
  FieldT extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<FieldT> = FieldArrayPath<FieldT>,
  TKeyName extends string = "id",
  TTransformedValues = FieldT,
> {
  formFieldArray: UseFieldArrayProps<
    FieldT,
    TFieldArrayName,
    TKeyName,
    TTransformedValues
  >;
  fieldProperties?: {
    title?: string;
    keyTitle?: string;
    showSwapIcon?: boolean
    showSubName?: boolean
  } & NestedComponentLevel;
  internalFunction?: {
    appendField: FieldArray<FieldT, TFieldArrayName>;
  };
}

export type UseNestedComponentFields<
  FieldT extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<FieldT> = FieldArrayPath<FieldT>,
  TKeyName extends string = "id",
  TTransformedValues = FieldT,
> = Pick<
  NestedComponentFields<FieldT, TFieldArrayName, TKeyName, TTransformedValues>,
  "formFieldArray" | "internalFunction"
>;
