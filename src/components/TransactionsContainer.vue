<template>
  <div class="transactions">
    <div class="transactions__title wrapper">
      <Tr>Transactions</Tr>
    </div>
    <div class="transactions__list" v-if="transactions.length">
      <div class="transactions__list-inner wrapper">
        <TransactionItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
        />
      </div>
    </div>
    <div class="" v-else>
      <EmptyState>
        <Tr>No transactions</Tr>
      </EmptyState>
    </div>
    <div class="transactions__buttons wrapper">
      <button
        class="button primary transactions__transfer"
        @click="openTransferModal"
      >
        <Tr>Transfer</Tr>
      </button>
      <button class="button" @click="openRequestModal">
        <Tr>Request</Tr>
      </button>
    </div>
  </div>
</template>

<script>
import {
  defineComponent, computed, onMounted, inject,
} from 'vue';
import { useStore } from 'vuex';
// import { $vfm } from 'vue-final-modal';

import TransactionItem from '@/components/TransactionItem.vue';
import EmptyState from '@/components/EmptyState.vue';

export default defineComponent({
  components: {
    TransactionItem,
    EmptyState,
  },
  setup() {
    const $vfm = inject('$vfm');
    const store = useStore();
    const transactions = computed(() => store.state.transactions);
    const walletAddress = computed(() => store.state.walletAddress);

    const openRequestModal = () => {
      $vfm.show('RequestModal');
    };
    const openTransferModal = () => {
      $vfm.show('TransferModal');
    };

    onMounted(() => {
      store.dispatch('fetchTransactions', walletAddress.value);
    });

    return {
      transactions,
      fetch,
      openRequestModal,
      openTransferModal,
    };
  },
});
</script>

<style lang="stylus" scoped>
.transactions {
  flex-grow: 2;

  &__title {
    opacity: 0.4;
    color: $dark-color-2;
    font-size: 12px;
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 5px;
  }

  &__list {
    padding-bottom: 10px;
    max-height: 350px;
    overflow-y: auto;
  }

  &__list-inner {
  }

  &__buttons {
    margin-top: 12px;
    margin-bottom: 12px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - 40px);
    border-top: 4px solid;
    border-color: $fade-color;
    padding-top: 12px;
  }

  &__transfer {
    margin-right: 16px;
  }
}
</style>
