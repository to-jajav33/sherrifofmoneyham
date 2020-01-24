import { VALUE_TYPES as __VALUE_TYPES } from "./state";

export function someGetter(/* paramState */) {}

export function VALUE_TYPES() {
  return __VALUE_TYPES;
}

export function nodes(paramState) {
  return paramState.nodes;
}

export function tags(paramState) {
  paramState.tags = [];

  for (let tagNodeKey of Object.keys(paramState.nodes)) {
    let tagNode = paramState.nodes[tagNodeKey];
    if (tagNode.tagName) {
      paramState.tags.push(tagNode);
    }
  }

  return paramState.tags;
}

export function transactions(paramState) {
  let out = [];

  out = paramState.transactions;

  return out;
}
