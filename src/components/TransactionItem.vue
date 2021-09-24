<template>
  <div class="transaction__item">
    <div class="transaction__type">
      {{ actionType === "out" ? "To" : "From" }}
    </div>
    <div class="transaction__address">
      {{ transactionId }}
    </div>
    <div
      class="transaction__amount"
      :class="{
        send: actionType === 'out',
        receive: actionType === 'in',
      }"
    >
      {{ `${transaction.actionType === "out" ? "-" : "+"}${sum}` }}
    </div>
    <div class="transaction__date">
      {{ date }}
    </div>
    <div class="transaction__currency">
      {{ transaction.outputs[0].ticker }}
    </div>
    <div class="transaction__bonus">
      <!-- {{ transaction.type }} -->
    </div>
    <div class="transaction__description">Transfer</div>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import { useStore } from 'vuex';
import * as dayjs from 'dayjs';
import { getActionType } from '@/utils/transactions';

export default defineComponent({
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const walletAddress = computed(() => store.state.walletAddress);
    const actionType = getActionType(props.transaction, walletAddress);
    const transactionId = `${props.transaction.id.substring(0, 35)}...`;
    const date = dayjs.unix(props.transaction.block.timestamp).format('D MMM HH:mm ');
    let sum = '';
    let currency = '';
    if (actionType === 'in') {
      const tran = props.transaction.outputs.find((item) => item.address === walletAddress.value);

      sum = ref(tran.amount);
      currency = ref(tran.ticker);
    } else {
      const tran = props.transaction.inputs.find((item) => item.address === walletAddress.value);

      sum = ref(tran.amount);
      currency = ref(tran.ticker);
    }
    // const transactionId = '123';

    return {
      actionType,
      transactionId,
      date,
      sum,
      currency,
    };
  },
});
</script>

<style lang="stylus" scoped>
.transaction {
  &__type {
    opacity: 0.4;
    grid-area: h;
  }

  &__address {
    font-weight: 700;
    grid-area: a;
    margin-bottom: 4px;
  }

  &__date {
    grid-area: d;
  }

  &__currency {
    grid-area: c;
    text-transform: uppercase;
  }

  &__bonus {
    grid-area: b;
  }

  &__amount {
    font-weight: 700;
    grid-area: v;
    justify-self: end;

    &.receive {
      color: $success-color;
    }

    &.send {
      color: $danger-color;
    }
  }

  &__description {
    grid-area: des;
  }

  &__item {
    font-size: 12px;
    margin-top: 8px;
    display: grid;
    grid-template-columns: 52px 1fr 1fr 52px;
    grid-template-areas: 'h h h h' 'a a a v' 'd c b .' 'd des . .';
  }
}
</style>
