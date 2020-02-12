<template>
  <div style="margin-left: 30px;">
    <!-- tag name -->
    <q-input
      dense
      v-if="!isRoot"
      filled
      label="Tag Name"
      v-model="__tagName"
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
              {{ this.myNode.actualValue }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="row">
      <q-btn
        @click="__addChild"
        color="primary"
        :disable="!isRoot && !myNode.tagName"
        icon="add"
        round
      ></q-btn>
      <div class="col"></div>
      <q-btn
        v-if="!isRoot"
        @click="__removeSelf()"
        color="negative"
        icon="delete"
        round
      ></q-btn>
    </div>

    <node
      v-for="(childNodeUID, childIndex) in myNode.children"
      :key="`childNodeUID_${childNodeUID}`"
      :myNode="nodes[childNodeUID]"
      :myIndex="childIndex"
    >
    </node>
  </div>
</template>

<script>
import { uid } from "quasar";
import { mapActions, mapGetters } from "vuex";
import types from "../store/app/types";

export default {
  name: "node",
  computed: {
    ...mapGetters("app", ["VALUE_TYPES", "nodes"]),
    actualValue() {
      return this.myNode.actualValue;
    },
    enteredPlannedValue: {
      get: function() {
        return this.myNode.enteredPlannedValue;
      },
      set: function(val) {
        this.setEnteredPlannedValue({ uid: this.myNode.uid, value: val });
        this.plannedValue = val;
      }
    },
    isRoot() {
      return this.myNode && !this.nodes[this.myNode.parent];
    },
    parentRemainingPlannedValue() {
      return this.myNode.parent
        ? this.nodes[this.myNode.parent].remainingPlannedValue
        : 0;
    },
    plannedValue: {
      get: function() {
        return this.myNode.plannedValue;
      },
      set: function() {
        this.__updatePlannedValue();
      }
    },
    __tagName: {
      get: function() {
        return this.myNode.tagName;
      },
      set: function(value) {
        this.setTagName({ uid: this.myNode.uid, value });
      }
    },
    valueType: {
      get: function() {
        return this.myNode.valueType;
      },
      set: function(val) {
        if (this.myNode.valueType !== val) {
          this.setValueType({ uid: this.myNode.uid, value: val });

          this.__updatePlannedValue();
        }
      }
    }
  },
  created() {
    if (this.isRoot) {
      this.myNode.valueType = this.VALUE_TYPES.FIXED;
      this.myNode.uid = this.myNode.uid || uid();
    }
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("app", [
      types.createNewChild,
      types.removeNode,
      types.setEnteredPlannedValue,
      types.setTagName,
      types.setValueType,
      types.updatePlannedValue
    ]),
    async __addChild() {
      let newChild = await this.createNewChild({
        parent: this.myNode.uid,
        store: this.$store
      });

      return newChild;
    },
    __removeSelf() {
      this.removeNode({ uid: this.myNode.uid });
    },
    __updatePlannedValue() {
      this.updatePlannedValue({ uid: this.myNode.uid });

      this.$forceUpdate();
    }
  },
  props: ["myNode", "myIndex"],
  watch: {
    actualValue() {},
    parentRemainingPlannedValue(val) {
      if (this.remainingPlannedValue !== val) {
        this.__updatePlannedValue();
      }
    }
  }
};
</script>
