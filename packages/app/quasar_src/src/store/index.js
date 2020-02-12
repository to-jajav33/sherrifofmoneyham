import Vue from "vue";
import Vuex from "vuex";

import app from "./app";
import types from "./app/types";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      app
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  });

  // Subscribe to store updates
  Store.subscribe((mutation, state) => {
    if (state.app) {
      // Store the state object as a JSON string
      localStorage.setItem(types.localStorageLocation, JSON.stringify(state));
    }
  });

  return Store;
}
