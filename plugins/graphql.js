import Vue from "vue";
import { http, query, responseHandler } from "../utils/graphql";
import token from "../utils/auth";

// client side
Vue.prototype.$graphql = function(queryString, variables = null, options = {}) {
  return query(queryString, variables, {
    ...options,
    headers: {
      Authorization: token.get()
    }
  });
};

// server side
export default function(context) {
  const { req } = context;
  context.$graphql = function(queryString, variables = null, options = {}) {
    return http
      .post(
        "/",
        {
          queryString,
          variables
        },
        {
          ...options,
          headers: {
            Authorization: token.get(req)
          }
        }
      )
      .then(responseHandler);
  };
}
