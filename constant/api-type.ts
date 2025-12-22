const apiTypes = ["array", "path", "query", "header"];
export const formatTypes = ["string", "number", "boolean"];

const schemasType = {
  array: {
    type: "array",
    items: {
      type: "string",
    },
  },
  query: {
    type: "string",
  },
  header: {
    type: "string",
  },
  path: {
    type: "string",
  },
};

export const mapSchemaTypes = (
  arg: keyof typeof schemasType,
  formatType: typeof formatTypes
) =>
  arg === "array"
    ? { ...schemasType[arg], items: { type: formatType ?? 'string' } }
    : { ...schemasType[arg], type: formatType ?? "string" };

export type ApiTypes = typeof apiTypes;

export default apiTypes;
