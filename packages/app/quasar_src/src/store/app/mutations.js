import { uid } from "quasar";
import { VALUE_TYPES } from "./state";
import types from "./types";
import Vue from "vue";
import { mapActions } from "vuex";

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
      actualValue: 0,
      tagName: ""
    };

    Vue.set(paramState.nodes, newNode.uid, newNode);

    // eslint-disable-next-line no-unused-vars
    let vm = new Vue({
      store: params.store,
      created() {
        this.$watch(
          () => newNode.actualValue,
          value => {
            if (newNode.parent) {
              this.updateActualValue({ uid: newNode.parent, value });
            }
          }
        );
      },
      methods: {
        ...mapActions("app", [types.updateActualValue])
      }
    });

    paramState.nodes[parent].children.push(newNode.uid);
    // paramState.nodes[newNode.uid] = newNode;

    paramParams.return = newNode;

    return newNode;
  },
  [types.createTransaction]: function(paramState, paramParams) {
    const { params } = paramParams;
    const { tagUID, value } = params;
    const nodes = paramState.nodes;
    let newTransaction;

    if (nodes[tagUID]) {
      let tagNode = nodes[tagUID];
      newTransaction = {
        uid: uid(),
        tagUID,
        value
      };

      Vue.set(paramState.transactions, newTransaction.uid, newTransaction);

      paramState.transactions[newTransaction.uid] = newTransaction;

      // update the actual node
      tagNode.actualValue += Number(value);

      newTransaction.tagUID = tagUID;
      newTransaction.value = value;
    }
    paramParams.return = newTransaction;

    return newTransaction;
  },
  [types.removeNode]: function(paramState, paramParams) {
    let { params } = paramParams;
    let node = paramState.nodes[params.uid];

    if (paramState.nodes[node.parent]) {
      let index = paramState.nodes[node.parent].children.indexOf(params.uid);
      let child = paramState.nodes[node.parent].children[index];
      paramState.nodes[node.parent].children.splice(index, 1);
      paramState.nodes[child.uid] = null;
    }
  },
  [types.setEnteredPlannedValue]: function(paramState, paramParams) {
    let { params } = paramParams;
    let node = paramState.nodes[params.uid];
    node.enteredPlannedValue = params.value;
  },
  [types.setTagName]: function(paramState, paramParams) {
    let { params } = paramParams;
    let node = paramState.nodes[params.uid];
    node.tagName = params.value;
  },
  [types.setValueType]: function(paramState, paramParams) {
    let { params } = paramParams;
    let node = paramState.nodes[params.uid];

    node.valueType = params.value;
  },
  [types.updateActualValue]: function(paramState, paramParams) {
    let { params } = paramParams;
    let node = paramState.nodes[params.uid];

    node.actualValue += params.value;
  },
  [types.updatePlannedValue]: function(paramState, paramParams) {
    const { params } = paramParams;
    const myNode = paramState.nodes[params.uid];

    if (myNode.valueType === VALUE_TYPES.FIXED) {
      myNode.remainingPlannedValue = Number(myNode.enteredPlannedValue);
    } else {
      myNode.remainingPlannedValue = 0;
    }

    if (paramState.nodes[myNode.parent]) {
      for (let childID of paramState.nodes[myNode.parent].children) {
        let child = paramState.nodes[childID];
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
