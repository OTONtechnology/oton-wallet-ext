<template>
  <div class="transactions">
    <div class="transactions__title wrapper">
      <Tr>Transactions</Tr>
    </div>
    <div ref="scrollLoader" class="transactions__list">
      <div
        ref="scrollInner"
        class="transactions__list-inner wrapper"
        v-if="transactions.length"
      >
        <TransactionItem
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
        />
      </div>

      <EmptyState v-else-if="!transactions.length && !isPending">
        <Tr>No transactions</Tr>
      </EmptyState>

      <Loader v-if="isPending" />
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
      <!-- <button @click="more">more</button> -->
    </div>
  </div>
</template>

<script>
import {
  defineComponent, computed, onMounted, inject, onUnmounted, ref,
} from 'vue';
import { useStore } from 'vuex';
import Loader from '@/components/Loader.vue';

import TransactionItem from '@/components/TransactionItem.vue';
import EmptyState from '@/components/EmptyState.vue';

export default defineComponent({
  components: {
    TransactionItem,
    Loader,
    EmptyState,
  },
  setup() {
    const $vfm = inject('$vfm');
    const store = useStore();
    const transactions = computed(() => store.getters['transactions/list']);
    const hasMore = computed(() => store.getters['transactions/hasMore']);
    const isPending = computed(() => store.getters['transactions/pending']);
    const walletAddress = computed(() => store.state.walletAddress);
    const scrollLoader = ref(null);
    const scrollInner = ref(null);

    const openRequestModal = () => {
      $vfm.show('RequestModal');
    };
    const openTransferModal = () => {
      $vfm.show('TransferModal');
    };
    const more = () => {
      store.dispatch('transactions/fetchTransactions', walletAddress.value);
    };

    const handleScroll = (e) => {
      const { height } = scrollInner.value.getBoundingClientRect();
      const scrolled = scrollLoader.value.scrollTop;

      if (scrolled > height - 500) {
        if (hasMore.value) {
          store.dispatch('transactions/fetchTransactions', walletAddress.value);
        }
      }
    };

    onMounted(() => {
      store.dispatch('transactions/fetchTransactions', walletAddress.value);

      scrollLoader.value.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      // const list = document.getElementById('transactions-list');
      // list.removeEventListener('scroll', handleScroll);
    });

    return {
      transactions,
      fetch,
      openRequestModal,
      openTransferModal,
      more,
      scrollLoader,
      scrollInner,
      hasMore,
      isPending,
    };
  },
});
</script>

<style lang="stylus" scoped>
.transactions {
  flex-grow: 2;
  display: flex;
  flex-direction: column;

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
    flex: 3;
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
