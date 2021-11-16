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
          {{ toFixedDown(getEur("oton", balance.balance), 4) }} €
        </span>
        <span class="balance__course">
          1 {{ currency }} = {{ toFixedDown(getRate("oton"), 4) }} €
        </span>
      </div>
    </div>
    <EmptyState v-if="balancesIsEmpty">
      <Tr>No currencies</Tr>
    </EmptyState>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import '@/assets/svg/ic_logo.svg?sprite';
import Decimal from 'decimal.js';
import { isEmpty } from 'rambda';
import EmptyState from '@/components/EmptyState.vue';
import toFixedDown from '@/utils/toFixedDown';

export default defineComponent({
  components: {
    EmptyState,
  },
  setup() {
    const store = useStore();
    const balances = computed(() => store.getters['balances/balances']);
    const rates = computed(() => store.getters['rates/rates']);
    const walletAddress = computed(() => store.state.walletAddress);
    const balancesIsEmpty = computed(() => isEmpty(store.getters['balances/balances']));

    const floorNum = (num) => Math.round((num + Number.EPSILON) * 10000) / 10000;

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
      store.dispatch('balances/fetchBalances', walletAddress.value);
      store.dispatch('coins/fetchCoins');
      store.dispatch('rates/fetchRates');
    });

    return {
      balances,
      rates,
      balancesIsEmpty,
      getEur,
      getRate,
      floorNum,
      toFixedDown,
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
