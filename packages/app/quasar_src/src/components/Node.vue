<template>
  <div style="margin-left: 30px;">
    <!-- tag name -->
    <q-input
      dense
      v-if="!isRoot"
      filled
      label="Tag Name"
      v-model="myNode.tagName"
    ></q-input>

    <div class="row col">
      <!-- entered value -->
      <q-input
        class="col"
        dense
        filled
        label="Value"
        v-model="myNode.enteredPlannedValue"
      ></q-input>

      <!-- value type -->
      <q-select
        class="col"
        dense
        v-if="!isRoot"
        filled
        label="Value Type"
        :options="Object.keys(VALUE_TYPES)"
        v-model="myNode.valueType"
      ></q-select>
    </div>

    <div class="row">
      <q-btn
        @click="addChild"
        color="primary"
        :disable="!isRoot && !myNode.tagName"
        icon="add"
        round
      ></q-btn>
      <div class="col"></div>
      <q-btn
        v-if="!isRoot"
        @click="removeSelf()"
        color="negative"
        icon="delete"
        round
      ></q-btn>
    </div>
    <node
      v-for="(childNode, childIndex) in myNode.children"
      :key="`childNode_${childNode.uid}`"
      :myNode="childNode"
      :myIndex="childIndex"
    >
    </node>
  </div>
</template>

<script>
import { uid } from "quasar";

export const VALUE_TYPES = {
  FIXED: "FIXED",
  PERCENT: "PERCENT"
};

export default {
  name: "node",
  computed: {
    isRoot() {
      return this.myNode && !this.myNode.parent;
    }
  },
  data() {
    return {
      VALUE_TYPES
    };
  },
  methods: {
    addChild() {
      this.myNode.children.push({
        uid: uid(),
        parent: this.myNode,
        valueType: VALUE_TYPES.FIXED,
        children: [],
        enteredPlannedValue: 0,
        planned: 0,
        actual: 0
      });
    },
    removeSelf() {
      if (this.myNode.parent) {
        this.myNode.parent.children.splice(this.myIndex, 1);
      }
    }
  },
  created() {
    if (this.isRoot) {
      this.myNode.valueType = VALUE_TYPES.FIXED;
      this.myNode.uid = this.myNode.uid || uid();
    }
  },
  props: ["myNode", "myIndex"]
};
</script>
