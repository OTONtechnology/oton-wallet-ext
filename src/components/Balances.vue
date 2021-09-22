<template>
  <div class="balances wrapper">
    <div
      class="balances__balance balance"
      v-for="balance in balances"
      :key="balance.name"
    >
      <div class="balance__head">
        <span class="balance__balance">{{ balance.balance_oton }}</span>
        <span class="balance__currency">{{ balance.name }}</span>
      </div>
      <div class="balance__footer">
        <span class="balance__eur">{{ balance.balance_eur }} €</span>
        <span class="balance__course">{{ balance.course }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import '@/assets/svg/ic_logo.svg?sprite';

export default defineComponent({
  setup() {
    onMounted(() => {
      const store = useStore();
      store.dispatch('fetchTransactions', '903b3493a3fc2f9e9af1b6e735a990d6fa471054');
    });
  },
  data() {
    return {
      balances: [
        {
          name: 'OTON',
          balance_oton: '54 641',
          balance_eur: '1311.38',
          course: '1 OTON = 0.05215 €',
        },

        {
          name: 'USDT',
          balance_oton: '155',
          balance_eur: '151.13',
          course: '1 USDT = 0.975 €',
        },
      ],
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
