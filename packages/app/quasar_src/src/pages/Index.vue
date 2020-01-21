<template>
  <q-page class="flex flex-center">
    <div class="column">
      <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" /> -->
      <node :myNode="root" :myIndex="0"></node>
    </div>
  </q-page>
</template>

<script>
import { default as Node, VALUE_TYPES } from "../components/Node";

export default {
  components: {
    Node
  },
  name: "PageIndex",
  data() {
    return {
      root: {
        parent: null,
        enteredPlannedValue: 2000,
        plannedValue: 2000,
        actualValue: 0,
        children: [],
        valueType: VALUE_TYPES.FIXED // fixed or percent
      }
    };
  }
};
</script>
