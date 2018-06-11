import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:6099/api/graphql",
  withCredentials: true
});

export function responseHandler(res) {
  const data = res.data;
  if (data.errors && data.errors.length) {
    const firstError = data.errors.shift();
    return Promise.reject(new Error(firstError.message));
  }
  if (data && typeof data === "object") {
    Object.defineProperty(data, "$response", res);
  }
  return data;
}

export function query(query, variables = null, options) {
  return http
    .post(
      "/",
      {
        query,
        variables
      },
      options
    )
    .then(responseHandler);
}
