<template>
  <q-page class="flex flex-center">
    <div class="column">
      <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg" /> -->
      <node :myNode="__root" :myIndex="0"></node>
    </div>
  </q-page>
</template>

<script>
import { default as Node } from "../components/Node";
import { mapGetters } from "vuex";

export default {
  components: {
    Node
  },
  name: "PageIndex",
  computed: {
    ...mapGetters("app", ["nodes"]),
    __root() {
      return this.nodes.root;
    }
  },
  data() {
    return {};
  }
};
</script>
