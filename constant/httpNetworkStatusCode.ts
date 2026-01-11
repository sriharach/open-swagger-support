export type HttpStatusCategory =
  | "Informational"
  | "Success"
  | "Redirection"
  | "Client Error"
  | "Server Error";

export interface NetworkStatus {
  code: number;
  message: string;
  description: string;
  category: HttpStatusCategory;
}

export const HTTP_STATUS_CODES: NetworkStatus[] = [
  {
    code: 200,
    message: "OK",
    category: "Success",
    description:
      "The request reached the server and was processed successfully.",
  },
  {
    code: 201,
    message: "Created",
    category: "Success",
    description: "The request succeeded and a new resource was created.",
  },
  {
    code: 204,
    message: "No Content",
    category: "Success",
    description:
      "The server successfully processed the request but is not returning any content.",
  },
  {
    code: 400,
    message: "Bad Request",
    category: "Client Error",
    description:
      "The server cannot process the request due to client error (e.g., malformed syntax).",
  },
  {
    code: 401,
    message: "Unauthorized",
    category: "Client Error",
    description:
      "Authentication is required and has failed or has not yet been provided.",
  },
  {
    code: 403,
    message: "Forbidden",
    category: "Client Error",
    description: "The client does not have access rights to the content.",
  },
  {
    code: 404,
    message: "Not Found",
    category: "Client Error",
    description: "The server cannot find the requested resource.",
  },
  {
    code: 500,
    message: "Internal Server Error",
    category: "Server Error",
    description:
      "The server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
  {
    code: 503,
    message: "Service Unavailable",
    category: "Server Error",
    description:
      "The server is currently unable to handle the request (overloaded or down for maintenance).",
  },
];

// Usage of the type for a specific status code
export type StatusCode = (typeof HTTP_STATUS_CODES)[number]["code"];
