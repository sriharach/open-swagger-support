// libs
import { Controller, FieldArrayPath } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { memo } from "react";
import clsx from "clsx";

// types
import { FieldValues, NestedComponentFields } from "./type";

// components
import PlusIcon from "@/components/icons/PlusIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import ArrowUpSolid from "@/components/icons/ArrowUpSolid";
import TrashIcon from "@/components/icons/TrashIcon";
import { formatSchemasType, formatTypes } from "@/constant/api-type";

// controller
import useNestedComponent from "./controllers/useNestedComponent.controller";

const NestedComponent = <
  FieldT extends FieldValues = FieldValues,
  TFieldArrayName extends FieldArrayPath<FieldT> = FieldArrayPath<FieldT>,
  TKeyName extends string = "id",
  TTransformedValues = FieldT,
>({
  formFieldArray,
  fieldProperties,
  internalFuction,
}: NestedComponentFields<
  FieldT,
  TFieldArrayName,
  TKeyName,
  TTransformedValues
>) => {
  // props
  const {
    level = 0,
    keyTitle,
    title = "Hello Title",
    showSwapIcon,
    showSubName
  } = fieldProperties ?? {};

  // hooks
  const {
    fieldArray: { fields },
    formContext,
    onClickAppendFieldArray,
    onClickRemoveFieldArray,
    onClickMoveUpFieldArray,
    onClickMoveDownFieldArray,
  } = useNestedComponent<FieldT, TFieldArrayName, TKeyName, TTransformedValues>(
    { formFieldArray, internalFuction },
  );

  return (
    <>
      <div className="flex flex-row flex-1" style={{ marginLeft: level * 14 }}>
        <strong className="text-md min-w-64">
          {title} :{" "}
          {keyTitle && <span className="text-green-1 text-md">{keyTitle}</span>}{" "}
          ({fields.length})
        </strong>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          className="max-w-30"
          onPress={onClickAppendFieldArray}
        >
          <PlusIcon />
        </Button>
      </div>
      {fields.map((property, propertyIndex) => {
        const codexName = `${formFieldArray.name}.${propertyIndex}`;
        const getOpenChildren = formContext.watch(
          `${codexName}.isOpenChildren`,
        ) as unknown as boolean;

        return (
          <Controller
            key={property.id}
            control={formFieldArray.control}
            name={`${codexName}.format` as never}
            render={({ field }) => {
              // const currentFormatTypes =
              //   field.value === "array"
              //     ? [...formatSchemasType, ...formatSchemaValue]
              //     : formatSchemasType;

              return (
                <div
                  className={clsx("flex flex-col gap-1.5 ", {
                    "relative after:w-full after:h-px after:border-b-2 after:border-dotted after:border-green-1 after:my-2":
                      propertyIndex < fields.length - 1 && field.value !== "",
                  })}
                  style={{ marginLeft: level * 14 }}
                >
                  <div className="flex flex-row gap-1.5 items-center">
                    <div className="flex flex-row gap-0.5 items-center">
                      {/* icon extend children variable */}
                      {field.value != "" && (
                        <Controller
                          control={formFieldArray.control}
                          name={`${codexName}.isOpenChildren` as never}
                          render={({ field }) => {
                            return (
                              <i
                                className={clsx(
                                  "cursor-pointer transition-all",
                                  {
                                    "rotate-90 hover:-rotate-90": field.value,
                                    "-rotate-90 hover:rotate-90": !field.value,
                                  },
                                )}
                              >
                                <ArrowRightIcon
                                  onClick={() => field.onChange(!field.value)}
                                  className="size-5 text-green-1"
                                />
                              </i>
                            );
                          }}
                        />
                      )}

                      {/* icon move up-down */}
                      {showSwapIcon && fields.length > 1 && (
                        <>
                          <i
                            className={clsx("cursor-pointer")}
                            onClick={() =>
                              onClickMoveUpFieldArray(propertyIndex)
                            }
                          >
                            <ArrowUpSolid className="size-5 text-green-1" />
                          </i>
                          <i
                            className={clsx("cursor-pointer rotate-180")}
                            onClick={() =>
                              onClickMoveDownFieldArray(propertyIndex)
                            }
                          >
                            <ArrowUpSolid className="size-5 text-green-1" />
                          </i>
                        </>
                      )}

                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                        onPress={() => onClickRemoveFieldArray(propertyIndex)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>

                    <Select
                      onSelectionChange={(value) => {
                        field.onChange(value.currentKey);
                        formContext.resetField(`${codexName}.key`);
                        formContext.resetField(`${codexName}.type`);
                        formContext.resetField(`${codexName}.example`);
                        formContext.resetField(`${codexName}.properties`);
                      }}
                      selectedKeys={[field.value]}
                      label="Format"
                      className="max-w-32"
                      variant="underlined"
                    >
                      {formatSchemasType.map((val) => (
                        <SelectItem key={val.value}>{val.label}</SelectItem>
                      ))}
                    </Select>

                    <Controller
                      control={formFieldArray.control}
                      name={`${codexName}.key` as never}
                      render={({ field }) => {
                        return (
                          <Input
                            {...field}
                            label="Name"
                            variant="bordered"
                            size="sm"
                            className="max-w-32"
                          />
                        );
                      }}
                    />

                    {showSubName && field.value != "" && (
                      <Controller
                        control={formFieldArray.control}
                        name={`${codexName}.subName` as never}
                        render={({ field }) => {
                          return (
                            <Input
                              {...field}
                              label="Sub-Name"
                              variant="bordered"
                              size="sm"
                              className="max-w-32"
                            />
                          );
                        }}
                      />
                    )}

                    {field.value === "" && (
                      <Controller
                        control={formFieldArray.control}
                        name={`${codexName}.type` as never}
                        render={({ field: fieldType }) => {
                          return (
                            <>
                              <Select
                                onSelectionChange={(value) =>
                                  fieldType.onChange(value.currentKey)
                                }
                                selectedKeys={[fieldType.value]}
                                label="Type"
                                className="max-w-32"
                                variant="underlined"
                              >
                                {formatTypes.map((format) => {
                                  return (
                                    <SelectItem key={format.value}>
                                      {format.label}
                                    </SelectItem>
                                  );
                                })}
                              </Select>
                              <Controller
                                control={formFieldArray.control}
                                name={`${codexName}.example` as never}
                                render={({ field }) => {
                                  // example change input to be select
                                  if (fieldType.value === "boolean") {
                                    return (
                                      <Select
                                        onSelectionChange={(value) =>
                                          field.onChange(value.currentKey)
                                        }
                                        selectedKeys={[field.value]}
                                        label="Example"
                                        className="max-w-32"
                                        variant="underlined"
                                      >
                                        <SelectItem key={"true"}>
                                          true
                                        </SelectItem>
                                        <SelectItem key={"false"}>
                                          false
                                        </SelectItem>
                                      </Select>
                                    );
                                  }

                                  // default input text
                                  return (
                                    <Input
                                      {...field}
                                      type={
                                        fieldType.value === "number"
                                          ? "number"
                                          : "text"
                                      }
                                      label="Example"
                                      variant="bordered"
                                      size="sm"
                                      className="max-w-32"
                                    />
                                  );
                                }}
                              />
                            </>
                          );
                        }}
                      />
                    )}
                  </div>
                  {field.value !== "" && getOpenChildren && (
                    <NestedComponent
                      fieldProperties={{
                        ...fieldProperties,
                        keyTitle: formContext.watch(
                          `${codexName}.key` as never,
                        ) as unknown as string,
                        level: level + 1,
                      }}
                      formFieldArray={{
                        control: formFieldArray.control,
                        name: `${codexName}.properties` as never,
                      }}
                      internalFuction={internalFuction}
                    />
                  )}
                </div>
              );
            }}
          />
        );
      })}
    </>
  );
};

// export default NestedComponent
export default memo(
  NestedComponent,
  (prevProps, nextProps) =>
    prevProps.fieldProperties === nextProps.fieldProperties &&
    prevProps.formFieldArray === nextProps.formFieldArray &&
    prevProps.internalFuction === nextProps.internalFuction,
) as typeof NestedComponent;
