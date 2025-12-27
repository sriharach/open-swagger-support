import { memo } from "react";
import SwaggerUI from "swagger-ui-react";

const MemoSwagger = memo((props: { spec: string }) => {
  // console.log("props :>> ", props.spec);
  return SwaggerUI({ spec: props.spec });
});
MemoSwagger.displayName = "MemoSwagger";

export default MemoSwagger;
