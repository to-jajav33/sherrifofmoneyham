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
  [types.createTransaction]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.createTransaction, out);

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
  [types.setEnteredPlannedValue]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.setEnteredPlannedValue, out);
  },
  [types.setTagName]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.setTagName, out);

    return out.return;
  },
  [types.setValueType]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.setValueType, out);

    return out.return;
  },
  [types.updateActualValue]: async function(paramContext, params) {
    let out = {
      params,
      return: null
    };
    paramContext.commit(types.updateActualValue, out);

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
