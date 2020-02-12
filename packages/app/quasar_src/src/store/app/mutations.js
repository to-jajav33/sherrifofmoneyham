import { uid } from "quasar";
import { VALUE_TYPES } from "./state";
import types from "./types";
import Vue from "vue";
import { mapActions } from "vuex";
import { version } from "../../../package.json";

export function recursiveRemoveNode(paramState, inheritingUID, nodeUID) {
  let node = paramState.nodes[nodeUID];
  let index = paramState.nodes[node.parent].children.indexOf(nodeUID);
  let childUID = paramState.nodes[node.parent].children[index];
  let child = paramState.nodes[childUID];
  let inheritingChild = paramState.nodes[inheritingUID];
  let transactions = child.transactions;
  paramState.nodes[node.parent].children.splice(index, 1);

  for (let transactionUID of transactions) {
    let transaction = paramState.transactions[transactionUID];
    // transaction will pass the value up one
    transaction.tagUID = inheritingUID;

    // then if tag doesn't have transaction.. attach it.
    if (inheritingChild.transactions.indexOf(transaction.uid) < 0) {
      inheritingChild.transactions.push(transaction.uid);
    }
  }

  for (let childKey in node.children) {
    recursiveRemoveNode(paramState, inheritingUID, childKey);
  }

  child = null;

  Vue.delete(paramState.nodes, childUID);
}

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
      tagName: "",
      transactions: []
    };

    Vue.set(paramState.nodes, newNode.uid, newNode);

    // eslint-disable-next-line no-unused-vars
    let vm = new Vue({
      store: params.store,
      created() {
        this.$watch(
          () => newNode.actualValue,
          (newValue, oldValue) => {
            if (newNode.parent) {
              this.updateActualValue({
                uid: newNode.parent,
                value: newValue - oldValue
              });
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

      // add transaction to tag to keep track of deletions
      if (
        paramState.nodes[tagUID].transactions.indexOf(newTransaction.uid) < 0
      ) {
        paramState.nodes[tagUID].transactions.push(newTransaction.uid);
      }
    }
    paramParams.return = newTransaction;

    return newTransaction;
  },
  [types.initializeStore]: function(state) {
    // Check if the store exists
    if (localStorage.getItem(types.localStorageLocation)) {
      let store = JSON.parse(localStorage.getItem(types.localStorageLocation));

      // Check the version stored against current. If different, don't
      // load the cached version
      if (store.app && store.app.version == version) {
        Object.assign(state, store.app);
        this.replaceState(store);
      } else {
        state.version = version;
      }
    }
  },
  [types.removeNode]: function(paramState, paramParams) {
    let { params } = paramParams;
    let node = paramState.nodes[params.uid];
    let inheritingUID = node.parent;

    if (paramState.nodes[node.parent]) {
      recursiveRemoveNode(paramState, inheritingUID, params.uid);
    }
  },
  [types.removeTransaction]: function(paramState, paramParams) {
    let { params } = paramParams;

    let transaction = paramState.transactions[params.uid];
    if (transaction) {
      let tag = paramState.nodes[transaction.tagUID];

      // remove the actual value that was added before
      tag.actualValue -= transaction.value;

      // remove any reference of the transaction in the tag
      // using a while tag incase it was accidentally added more than once
      while (tag.transactions.indexOf(transaction.uid) >= 0) {
        tag.transactions.splice(tag.transactions.indexOf(transaction.uid), 1);
      }

      // now delete the transaction from state
      Vue.delete(paramState.transactions, transaction.uid);
      paramState.transactions[transaction.uid] = null;
      delete paramState.transactions[transaction.uid];
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
