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
      <div class="balance__footer">
        <span class="balance__eur">
          {{ getEur("oton", balance.balance) }} €
        </span>
        <span class="balance__course">
          1 {{ currency }} = {{ getRate("oton") }} €
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import '@/assets/svg/ic_logo.svg?sprite';
import Decimal from 'decimal.js';

export default defineComponent({
  setup() {
    const store = useStore();
    const balances = computed(() => store.state.balances);
    const rates = computed(() => store.state.rates);
    const walletAddress = computed(() => store.state.walletAddress);

    const getEur = (currency, sum) => {
      if (!rates.value[currency]) {
        return '-';
      }
      const converted = Decimal.div(sum, rates.value[currency]).mul(rates.value.eur);
      return converted.toNumber();
    };

    const getRate = (currency) => {
      if (!rates.value[currency]) {
        return '-';
      }
      const course = Decimal.div(rates.value[currency], rates.value.eur);
      return course.toNumber();
    };

    onMounted(async () => {
      store.dispatch('fetchBalances', walletAddress.value);
      store.dispatch('fetchRates');
    });

    return {
      balances, rates, getEur, getRate,
    };
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
    margin-left: 8px;
  }
}
</style>
