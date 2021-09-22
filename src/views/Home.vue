<template>
  <div>
    <Header />
    <Balances />
    <TransactionsContainer />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Balances from '@/components/Balances.vue';
import TransactionsContainer from '@/components/TransactionsContainer.vue';

export default defineComponent({
  components: { Header, Balances, TransactionsContainer },
});
</script>
