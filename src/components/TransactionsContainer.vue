<template>
  <div class="transactions">
    <div class="transactions__title wrapper">Transactions</div>
    <div class="transactions__list">
      <div class="transactions__list-inner wrapper">
        <TransactionItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
        />
      </div>
    </div>
    <div class="transactions__buttons wrapper">
      <button
        class="button primary transactions__transfer"
        @click="openTransferModal"
      >
        Transfer
      </button>
      <button class="button">Request</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { $vfm } from 'vue-final-modal';

import TransactionItem from '@/components/TransactionItem.vue';

export default defineComponent({
  components: {
    TransactionItem,
  },
  setup() {
    const store = useStore();
    const transactions = computed(() => store.state.transactions);
    const walletAddress = computed(() => store.state.walletAddress);

    onMounted(() => {
      store.dispatch('fetchTransactions', walletAddress.value);
    });

    return {
      transactions,
      fetch,
    };
  },
  data() {
    return {
      // transactions: [
      //   {
      //     actionType: 'send',
      //     address: '0x7455324555ff838e5659d48b58b6c17651011f05',
      //     description: 'Transfer',
      //     bonus_type: '',
      //     amount: '12',
      //     currencySymbol: 'OTON',
      //     date: '12 sep 15:52',
      //   },
      //   {
      //     actionType: 'receive',
      //     address: '0x135664530ff838e5659d48b58b6c17651045345',
      //     description: 'Transfer',
      //     bonus_type: '-',
      //     amount: '234',
      //     currencySymbol: 'USDT',
      //     date: '12 sep 15:52',
      //   },
      //   {
      //     actionType: 'send',
      //     address: '0x7455324555ff838e5659d48b58b6c17651011f05',
      //     description: 'OTON Market',
      //     bonus_type: 'Awesome bonus',
      //     amount: '12',
      //     currencySymbol: 'OTON',
      //     date: '12 sep 15:52',
      //   },
      //   {
      //     actionType: 'send',
      //     address: '0x7455324555ff838e5659d48b58b6c17651011f05',
      //     description: 'OTON Market',
      //     bonus_type: 'Awesome bonus',
      //     amount: '12',
      //     currencySymbol: 'OTON',
      //     date: '12 sep 15:52',
      //   },
      //   {
      //     actionType: 'send',
      //     address: '0x7455324555ff838e5659d48b58b6c17651011f05',
      //     description: 'OTON Market',
      //     bonus_type: 'Awesome bonus',
      //     amount: '12',
      //     currencySymbol: 'OTON',
      //     date: '12 sep 15:52',
      //   },
      //   {
      //     actionType: 'send',
      //     address: '0x7455324555ff838e5659d48b58b6c17651011f05',
      //     description: 'Transfer',
      //     bonus_type: '',
      //     amount: '12',
      //     currencySymbol: 'OTON',
      //     date: '12 sep 15:52',
      //   },
      // ],
    };
  },

  methods: {
    openTransferModal() {
      $vfm.show('TransferModal');
    },

  },
});
</script>

<style lang="stylus" scoped>
.transactions {
  &__title {
    opacity: 0.4;
    color: $dark-color-2;
    font-size: 12px;
    text-transform: uppercase;
    margin-top: 12px;
    margin-bottom: 5px;
  }

  &__list {
    border-bottom: 4px solid;
    border-color: $fade-color;
    padding-bottom: 10px;
    max-height: 305px;
    overflow-y: auto;
  }

  &__list-inner {
  }

  &__buttons {
    margin-top: 12px;
  }

  &__transfer {
    margin-right: 16px;
  }
}
</style>
