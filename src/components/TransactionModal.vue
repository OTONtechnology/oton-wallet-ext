<template>
  <DefaultModalLayout
    :name="name"
    :title="'Transaction'"
    @set-params="setParams"
  >
    <div class="transaction" v-if="transaction">
      <div class="transaction__block">
        <div class="transaction__title">Date and Time</div>
        <div class="transaction__text">
          {{ convertDate(transaction.block.timestamp) }}
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title">Hash</div>
        <div class="transaction__text">
          {{ transaction.id.substr(0, 40) + "..." }}
        </div>
      </div>
      <div class="transaction__block address">
        <div class="transaction__title">Senders</div>
        <div
          class="transaction__text"
          v-for="input in transaction.inputs"
          :key="input.id"
        >
          {{ input.address.substr(0, 20) + "..." }}
          <span class="address__sum send">
            {{ input.amount }}
            <span class="address__ticker">
              {{ input.ticker }}
            </span>
          </span>
        </div>
      </div>
      <div class="transaction__block address">
        <div class="transaction__title">Recipients</div>
        <div
          class="transaction__text"
          v-for="output in transaction.outputs"
          :key="output.id"
        >
          {{ output.address.substr(0, 20) + "..." }}
          <span class="address__sum receive">
            {{ output.amount }}
            <span class="address__ticker">
              {{ output.ticker }}
            </span>
          </span>
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title">Currency</div>
        <div class="transaction__text uppercase">
          {{ currency }}
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title">Sum</div>
        <div class="transaction__text">
          {{ sum }}
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title">Type</div>
        <div class="transaction__text">
          {{ transaction.type }}
        </div>
      </div>
    </div>
  </DefaultModalLayout>
</template>

<script>
import {
  defineComponent, reactive, computed,
} from 'vue';
import * as dayjs from 'dayjs';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import sumInputs from '@/utils/sumInputs';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  props: {
    name: {
      type: String,
      required: false,
    },
  },
  setup() {
    let transaction = reactive({ });
    const sum = computed(() => sumInputs(transaction.inputs));
    const currency = computed(() => transaction.inputs[0].ticker);

    const setParams = (params) => {
      transaction = Object.assign(transaction, params.value.transaction);
    };

    const convertDate = (timestamp) => dayjs.unix(timestamp).format('D MMM, HH:mm ');

    return {
      transaction,
      setParams,
      convertDate,
      sum,
      currency,
    };
  },
});
</script>

<style lang="stylus" scoped>
.transaction {
  &__block {
    margin-top: 18px;
  }

  &__title {
    opacity: 0.4;
    font-size: 14px;
  }

  &__text {
    display: flex;
    justify-content: space-between;
  }
}

.address {
  &__sum {
    text-transform: uppercase;
    font-weight: 700;

    &.receive {
      color: $success-color;
    }

    &.send {
      color: $danger-color;
    }
  }

  &__ticker {
  }
}
</style>
