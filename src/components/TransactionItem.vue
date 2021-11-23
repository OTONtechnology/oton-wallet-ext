<template>
  <div class="transaction">
    <div class="transaction__box">
      <div @click="openTransaction" class="transaction__hash">
        {{ transaction.id }}
      </div>
      <div class="transaction__info">
        <div class="transaction__date">{{ date }}</div>
        <div class="transaction__type">
          {{ transaction.type }}
        </div>
      </div>
      <div class="transaction__recepient">
        <span>{{ recepient }}</span>
      </div>
    </div>
    <div class="transaction__box">
      <div
        class="transaction__input"
        v-for="(sum, name) in sumByTickers"
        :key="`ticker-${sum}-${name}`"
      >
        <span
          class="transaction__amount"
          :class="{
            sent: actionType === 'sent',
            receive: actionType === 'receive',
          }"
        >
          {{ sum }}
        </span>
        <span class="transaction__ticker">{{ name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import * as dayjs from 'dayjs';
import { $vfm } from 'vue-final-modal';
import { sumByAddressGrouped } from '@/utils/sumInputs';
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
    const actionType = getActionType(props.transaction, walletAddress.value);
    const transactionId = `${props.transaction.id.substring(0, 35)}...`;
    const date = dayjs.unix(props.transaction.block.timestamp).format('D MMM HH:mm ');
    const recepient = computed(() => {
      if (props.transaction.outputs.length === 0) {
        return 'n/a';
      } if (props.transaction.outputs.length > 1) {
        return `${props.transaction.outputs.length} addresses`;
      }
      return props.transaction.outputs[0].address;
    });
    const sumByTickers = actionType === 'sent'
      ? sumByAddressGrouped(props.transaction.inputs, walletAddress.value)
      : sumByAddressGrouped(props.transaction.outputs, walletAddress.value);

    const openTransaction = () => {
      $vfm.show('TransactionModal', {
        transaction: props.transaction,
        walletAddress: walletAddress.value,
      });
    };

    return {
      actionType,
      transactionId,
      date,
      openTransaction,
      recepient,
      sumByTickers,
    };
  },
});
</script>

<style lang="stylus" scoped>
.transaction {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;

  &__box {
    position: relative;
    // min-width: 235px;
    display: flex;
    flex-direction: column;

    &:first-of-type {
      // max-width: 170px;
      flex-shrink: 1;
      flex-grow: 1;
      flex-basis: min-content;
      word-break: break-all;
    }

    &:last-of-type {
      // flex: 1;
      text-align: right;
    }

    &:after {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      content: '';
      display: block;
      width: 20px;
      height: 100%;
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0, #fff);
    }
  }

  &__hash {
    display: block;
    overflow: hidden;
    color: $dark-color-2;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    line-height: 20px;
    height: 20px;
    overflow: hidden;

    &:hover {
      color: $main-color;
    }

    &:active {
      opacity: 0.8;
    }
  }

  &__info {
    display: flex;
    margin-top: 2px;
    margin-bottom: 2px;
    font-size: 12px;
  }

  &__date {
    width: 100px;
  }

  &__recepient {
    opacity: 0.4;
    font-size: 12px;
    overflow: hidden;
    display: block;
    overflow: hidden;
    line-height: 18px;
    height: 18px;
  }

  &__input {
    display: flex;
  }

  &__amount {
    margin-left: 5px;
    text-align: right;
    font-weight: bold;

    &.sent {
      color: $danger-color;
    }

    &.receive {
      color: $success-color;
    }
  }

  &__ticker {
    display: block;
    overflow: hidden;
    text-transform: uppercase;
    font-weight: bold;
    width: 52px;
    padding-left: 4px;
    opacity: 0.4;
  }
}
</style>
