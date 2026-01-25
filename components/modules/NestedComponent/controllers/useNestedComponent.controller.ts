import React, { useCallback } from "react";
import { FieldValues, UseNestedComponentFields } from "../type";
import { FieldArrayPath, useFieldArray, useFormContext } from "react-hook-form";

const useNestedComponent = <
  FieldT extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<FieldT> = FieldArrayPath<FieldT>,
  TKeyName extends string = "id",
  TTransformedValues = FieldT,
>(
  props: UseNestedComponentFields<
    FieldT,
    TFieldArrayName,
    TKeyName,
    TTransformedValues
  >,
) => {
  // get all props
  const { formFieldArray, internalFunction } = props ?? {};

  //   hook form
  const fieldArray = useFieldArray({
    name: formFieldArray.name,
    control: formFieldArray.control,
  });
  const formContext = useFormContext();

  const onClickAppendFieldArray = useCallback(() => {
    const { append } = fieldArray;
    if (!internalFunction && typeof internalFunction === "undefined") return;

    append(internalFunction.appendField);
  }, [internalFunction]);

  const onClickRemoveFieldArray = (index: number) => {
    const { remove } = fieldArray;
    remove(index);
  };

  const onClickMoveUpFieldArray = (index: number) => {
    const { move } = fieldArray;
    if (index === 0) return;
    move(index, index - 1);
  };

  const onClickMoveDownFieldArray = (index: number) => {
    const { fields, move } = fieldArray;
    if (index === fields.length - 1) return;
    move(index, index + 1);
  };

  return {
    fieldArray,
    formContext,
    onClickAppendFieldArray,
    onClickRemoveFieldArray,
    onClickMoveUpFieldArray,
    onClickMoveDownFieldArray,
  };
};

export default useNestedComponent;
