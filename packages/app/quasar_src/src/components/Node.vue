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
        autocomplete="off"
        class="col"
        dense
        filled
        label="Value"
        v-model="enteredPlannedValue"
      ></q-input>

      <!-- value type -->
      <q-select
        class="col"
        dense
        v-if="!isRoot"
        filled
        label="Value Type"
        :options="Object.keys(VALUE_TYPES)"
        v-model="valueType"
      ></q-select>
    </div>

    <div class="row col">
      <q-list class="col">
        <q-item class="col">
          <q-item-section class="col">
            <q-item-label caption>
              Planned Value
            </q-item-label>
            <q-item-label>
              {{ myNode.plannedValue }}
            </q-item-label>
          </q-item-section>

          <q-item-section class="col">
            <q-item-label caption>
              Actual Value
            </q-item-label>
            <q-item-label>
              {{ actualValue }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
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
    actualValue() {
      return this.myNode.actualValue || 0;
    },
    enteredPlannedValue: {
      get: function() {
        return this.myNode.enteredPlannedValue;
      },
      set: function(val) {
        this.myNode.enteredPlannedValue = val;
        this.plannedValue = val;
      }
    },
    isRoot() {
      return this.myNode && !this.myNode.parent;
    },
    parentRemainingPlannedValue() {
      return this.myNode.parent ? this.myNode.parent.remainingPlannedValue : 0;
    },
    plannedValue: {
      get: function() {
        return this.myNode.plannedValue;
      },
      set: function() {
        this.updatePlannedValue();
      }
    },
    valueType: {
      get: function() {
        return this.myNode.valueType;
      },
      set: function(val) {
        if (this.myNode.valueType !== val) {
          this.myNode.valueType = val;

          this.updatePlannedValue();
        }
      }
    }
  },
  created() {
    if (this.isRoot) {
      this.myNode.valueType = VALUE_TYPES.FIXED;
      this.myNode.uid = this.myNode.uid || uid();
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
        plannedValue: 0,
        remainingPlannedValue: 0,
        actualValue: 0
      });
    },
    removeSelf() {
      if (this.myNode.parent) {
        this.myNode.parent.children.splice(this.myIndex, 1);
      }
    },
    updatePlannedValue() {
      if (this.myNode.valueType === VALUE_TYPES.FIXED) {
        this.myNode.remainingPlannedValue = Number(
          this.myNode.enteredPlannedValue
        );
      } else {
        this.myNode.remainingPlannedValue = 0;
      }

      if (this.myNode.parent) {
        for (let child of this.myNode.parent.children) {
          let startingVal = this.myNode.parent.plannedValue;
          startingVal -= child.remainingPlannedValue;

          this.myNode.parent.remainingPlannedValue = startingVal;
        }
      }

      let plannedValue = 0;
      let adujustedParentValue = this.myNode.parent
        ? this.myNode.parent.remainingPlannedValue
        : 0;

      if (this.myNode.valueType === VALUE_TYPES.PERCENT) {
        plannedValue =
          (Number(this.myNode.enteredPlannedValue) / 100) *
          adujustedParentValue;
      } else {
        plannedValue = Number(this.myNode.enteredPlannedValue);
      }

      this.myNode.plannedValue = plannedValue;

      this.$forceUpdate();
    }
  },
  props: ["myNode", "myIndex"],
  watch: {
    parentRemainingPlannedValue(val) {
      if (this.remainingPlannedValue !== val) {
        this.updatePlannedValue();
      }
    }
  }
};
</script>
