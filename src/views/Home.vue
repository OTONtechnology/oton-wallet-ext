<template>
  <div class="home__container">
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
  setup() {
    console.log(123123);
  },
});
</script>
<style lang="stylus" scoped>
.home {
  &__container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
}
</style>
