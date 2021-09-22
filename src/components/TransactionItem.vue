<template>
  <div class="transaction__item">
    <div class="transaction__type">
      {{ transaction.actionType === "send" ? "To" : "From" }}
    </div>
    <div class="transaction__address">
      {{ transaction.address }}
    </div>
    <div
      class="transaction__amount"
      :class="{
        send: transaction.actionType === 'send',
        receive: transaction.actionType === 'receive',
      }"
    >
      {{
        `${transaction.actionType === "send" ? "-" : "+"}${transaction.amount}`
      }}
    </div>
    <div class="transaction__date">
      {{ transaction.date }}
    </div>
    <div class="transaction__currency">
      {{ transaction.currencySymbol }}
    </div>
    <div class="transaction__bonus">
      {{ transaction.bonus_type }}
    </div>
    <div class="transaction__description">
      {{ transaction.description }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    transaction: {
      type: Object,
      required: true,
    },
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
