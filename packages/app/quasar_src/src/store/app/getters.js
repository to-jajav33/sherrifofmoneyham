import { VALUE_TYPES as __VALUE_TYPES } from "./state";

export function someGetter(/* paramState */) {}

export function VALUE_TYPES() {
  return __VALUE_TYPES;
}

export function nodes(paramState) {
  return paramState.nodes;
}

export function tags(paramState) {
  return paramState.nodes;
}

export function transactions(paramState) {
  let out = [];

  out = paramState.transactions;

  return out;
}
