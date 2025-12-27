import { OpenApiFormSupport } from "@/types/models/useForm";
import { Control } from "react-hook-form";

const NestedRequestBody = ({}: {
  nestIndex: number;
  control: Control<OpenApiFormSupport, any, OpenApiFormSupport>;
}) => {
  return <div>NestedRequestBody</div>;
};

export default NestedRequestBody;
