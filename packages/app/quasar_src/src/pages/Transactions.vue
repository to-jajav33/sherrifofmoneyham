<template>
  <q-page class="flex flex-center" padding>
    <div class="column col">
      <q-list class="col">
        <q-item class="col">
          <q-input
            type="number"
            filled
            class="col"
            label="Transaction Amount"
            @keypress.enter="onCreateTransaction"
            v-model="selectedTransactionVal"
          ></q-input>

          <div class="col-1"></div>

          <q-btn-dropdown
            class="col-2"
            color="primary"
            :label="
              nodes[selectedTransactionTagUID]
                ? nodes[selectedTransactionTagUID].tagName
                : 'TAGS'
            "
          >
            <q-list>
              <q-item
                @click="onSelectTag(tag.uid)"
                @keypress.enter="onSelectTag(tag.uid)"
                clickable
                dense
                v-show="tag.tagName"
                v-for="tag in __tags"
                :key="`tag_item_${tag.uid}`"
              >
                {{ tag.tagName }}
              </q-item>
            </q-list>
          </q-btn-dropdown>

          <div class="col-1"></div>

          <q-btn
            @click="onCreateTransaction"
            @keypress.enter="onCreateTransaction"
            color="primary"
            label="OK"
            round
          ></q-btn>
        </q-item>
      </q-list>

      <div class="bg-grey-3" style="height: 2px; width: 100%;"></div>

      <q-list>
        <q-item
          v-for="(transaction, iTransaction) in __transactions"
          :key="`transaction_item_${transaction.uid}`"
          :class="`${iTransaction % 2 ? 'bg-grey-2' : ''}`"
        >
          <q-item-section> $ {{ transaction.value }} </q-item-section>
          <q-item-section>
            {{
              nodes[transaction.tagUID]
                ? nodes[transaction.tagUID].tagName
                : "NO TAG FOUND"
            }}
          </q-item-section>
          <q-item-section>
            <q-btn
              @click="onDeleteTransaction(transaction.uid)"
              color="negative"
              icon="delete"
            ></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import types from "../store/app/types";

export default {
  // name: 'PageName',
  computed: {
    ...mapGetters("app", ["nodes", "transactions", "tags"]),
    __tags() {
      let tags = this.tags;
      debugger;
      return tags;
    },
    __transactions() {
      return this.transactions;
    }
  },
  data() {
    return {
      selectedTransactionVal: "",
      selectedTransactionTagUID: ""
    };
  },
  methods: {
    ...mapActions("app", [types.createTransaction, types.removeTransaction]),
    onCreateTransaction() {
      let value = this.selectedTransactionVal || "";
      let tagUID = this.selectedTransactionTagUID || "";
      if (value && value.trim() && tagUID && tagUID.trim()) {
        this.createTransaction({ value, tagUID });
      }
    },
    onDeleteTransaction(paramUID) {
      this.removeTransaction({ uid: paramUID });
    },
    onSelectTag(tagUID) {
      if (this.nodes[tagUID]) {
        this.selectedTransactionTagUID = tagUID;
      }
    }
  }
};
</script>
