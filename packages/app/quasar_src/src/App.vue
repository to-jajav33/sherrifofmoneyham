<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import types from "./store/app/types";
export default {
  name: "App",
  beforeCreate() {
    this.$store.commit("app/" + types.initializeStore);
  }
};
</script>
