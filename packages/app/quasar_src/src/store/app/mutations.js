import { uid } from "quasar";
import { VALUE_TYPES } from "./state";
import types from "./types";

export function someMutation(/* state */) {}

export default {
  [types.createNewChild]: function(paramState, paramParams) {
    const { params } = paramParams;
    const { parent } = params;
    let newNode = {
      uid: uid(),
      parent: parent,
      valueType: VALUE_TYPES.FIXED,
      children: [],
      enteredPlannedValue: 0,
      plannedValue: 0,
      remainingPlannedValue: 0,
      actualValue: 0
    };

    paramState.nodes[parent].children.push(newNode.uid);
    paramState.nodes[newNode.uid] = newNode;

    paramParams.return = newNode;

    return newNode;
  },
  [types.updatePlannedValue]: function(paramState, paramParams) {
    const { params } = paramParams;
    const myNode = paramState[params.node];

    if (myNode.valueType === VALUE_TYPES.FIXED) {
      myNode.remainingPlannedValue = Number(myNode.enteredPlannedValue);
    } else {
      myNode.remainingPlannedValue = 0;
    }

    if (paramState.nodes[myNode.parent]) {
      for (let child of paramState.nodes[myNode.parent].children) {
        let startingVal = paramState.nodes[myNode.parent].plannedValue;
        startingVal -= child.remainingPlannedValue;

        paramState.nodes[myNode.parent].remainingPlannedValue = startingVal;
      }
    }

    let plannedValue = 0;
    let adujustedParentValue = paramState.nodes[myNode.parent]
      ? paramState.nodes[myNode.parent].remainingPlannedValue
      : 0;

    if (myNode.valueType === VALUE_TYPES.PERCENT) {
      plannedValue =
        (Number(myNode.enteredPlannedValue) / 100) * adujustedParentValue;
    } else {
      plannedValue = Number(myNode.enteredPlannedValue);
    }

    myNode.plannedValue = plannedValue;
  }
};
