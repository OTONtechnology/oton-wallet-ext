<template>
  <div class="balances wrapper">
    <div
      class="balances__balance balance"
      v-for="(balance, currency) in balances"
      :key="currency"
    >
      <div class="balance__head">
        <span class="balance__balance">{{ balance.balance }}</span>
        <span class="balance__currency">{{ currency }}</span>
      </div>
      <!-- <div class="balance__footer">
        <span class="balance__eur">{{ balance.balance_eur }} €</span>
        <span class="balance__course">{{ balance.course }}</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import '@/assets/svg/ic_logo.svg?sprite';

export default defineComponent({
  setup() {
    const store = useStore();
    const balances = computed(() => store.state.balances);
    const walletAddress = computed(() => store.state.walletAddress);

    onMounted(async () => {
      store.dispatch('fetchBalances', walletAddress.value);
    });

    return { balances };
  },
});
</script>
<style lang="stylus" scoped>
.balances {
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 4px solid;
  border-color: $fade-color;
  min-height: 76px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.balance {
  margin: 16px 0;

  &__balance {
    color: $dark-color-2;
    font-size: 24px;
    font-weight: 700;
  }

  &__currency {
    opacity: 0.4;
    color: $dark-color-2;
    font-size: 20px;
    font-weight: 700;
    margin-left: 5px;
  }

  &__eur {
    color: $dark-color-2;
    font-size: 14px;
  }

  &__course {
    opacity: 0.4;
    color: $dark-color-2;
    font-size: 14px;
  }
}
</style>
