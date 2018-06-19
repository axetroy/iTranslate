import { query } from "~/utils/graphql";
import token from "~/utils/auth";
import { get } from "lodash";

export const state = () => ({
  user: null,
  runtime: {}
});

export const getters = {
  isAuthenticated(state) {
    return !!state.user;
  },
  loggedUser(state) {
    return state.user;
  }
};

export const mutations = {
  SET_USER(state, user) {
    state.user = user || null;
  },
  SET_RUNTIME(state, runtime) {
    state.runtime = runtime;
  }
};

export const actions = {
  // 初始化
  async nuxtServerInit({ commit, redirect }, { req, res }) {
    const tokenString = token.get(req);

    if (tokenString) {
      try {
        const data = await query(
          `
          query profile{
            me{
              user{
                uid
                username
                nickname
              }
            }
          }
      `,
          null,
          {
            headers: {
              ...{
                Authorization: token.get(req)
              }
            }
          }
        );

        const profile = get(data, ["data", "me", "user"]);

        commit("SET_USER", {
          username: profile.username,
          nickname: profile.nickname,
          uid: profile.uid
        });
      } catch (err) {
        console.error(err);
      }
    }
  },
  async login({ commit }, payload) {
    const res = await query(
      `
      mutation($argv: LoginArgv){
        public{
          login (argv: $argv){
            uid
            username
            nickname
            token
          }
        }
      }
    `,
      {
        argv: {
          username: payload.username,
          password: payload.password
        }
      }
    );
    const profile = get(res, ["data", "public", "login"]);
    token.set(profile.token);
    commit("SET_USER", {
      username: profile.username,
      nickname: profile.nickname,
      uid: profile.uid
    });
  },
  async logout({ commit }) {
    token.set("");
    commit("SET_USER", null);
  }
};
