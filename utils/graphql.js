import axios from "axios";

export const http = axios.create({
  baseURL: (process.server ? "http://api.host:8080" : "") + "/api/graphql",
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
        query: query.trim(),
        variables
      },
      options
    )
    .then(responseHandler)
    .catch(err => {
      if (typeof err.response === "object" && err.response.data) {
        const data = err.response.data;
        if (data && data.errors) {
          const firstError = data.errors.shift();
          return Promise.reject(new Error(firstError.message));
        }
      }
      return Promise.reject(err);
    });
}
