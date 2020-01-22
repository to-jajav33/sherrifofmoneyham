import types from "./types";

export function someAction(/* context */) {}

export default {
  [types.createNewChild]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.createNewChild, out);

    return out.return;
  },
  [types.removeNode]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.removeNode, out);

    return out.return;
  },
  [types.updatePlannedValue]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.updatePlannedValue, out);

    return out.return;
  }
};
