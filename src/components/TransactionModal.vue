<template>
  <DefaultModalLayout
    :name="name"
    :title="'Transaction'"
    @set-params="setParams"
  >
    <div class="transaction">
      <div class="transaction__block flexed">
        <div>
          <div class="transaction__title"><Tr>Date and Time</Tr></div>
          <div class="transaction__text">
            {{ convertDate(transaction.block.timestamp) }}
          </div>
        </div>
        <div>
          <div class="transaction__title"><Tr>Type</Tr></div>
          <div class="transaction__text">
            {{ transaction.type }}
          </div>
        </div>
        <div>
          <div class="transaction__title"><Tr>Total</Tr></div>
          <div class="transaction__text">
            <div
              class="transaction__sum"
              v-for="(sum, name) in sumByTickers"
              :key="`ticker-${sum}-${name}`"
            >
              <div class="transaction__amount">{{ sum }}</div>
              <div class="transaction__ticker">{{ name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title"><Tr>Senders</Tr></div>
        <div>
          <div
            class="transaction__put"
            v-for="input in transaction.inputs"
            :key="input.address"
          >
            <div class="transaction__address">{{ input.address }}</div>
            <div class="transaction__sum">
              <div class="transaction__amount sent">{{ input.amount }}</div>
              <div class="transaction__ticker">{{ input.ticker }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title"><Tr>Recepients</Tr></div>
        <div v-if="transaction.outputs.length">
          <div
            class="transaction__put"
            v-for="output in transaction.outputs"
            :key="output.address"
          >
            <div class="transaction__address">{{ output.address }}</div>
            <div class="transaction__sum">
              <div class="transaction__amount receive">{{ output.amount }}</div>
              <div class="transaction__ticker">{{ output.ticker }}</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="transaction__address"><Tr>n/a</Tr></div>
        </div>
      </div>
      <div class="transaction__buttons">
        <a :href="outLink" target="__blank" class="transaction__button button">
          <Tr>View in Explorer</Tr>
        </a>
      </div>
    </div>
  </DefaultModalLayout>
</template>

<script>
import {
  defineComponent, reactive, computed,
} from 'vue';
import * as dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import { sumInputsGrouped } from '@/utils/sumInputs';

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
    const { t } = useI18n();

    const sumByTickers = computed(() => sumInputsGrouped(transaction.inputs));
    const outLink = computed(() => `${process.env.VUE_APP_EXPLORER_URL}/transaction/${transaction.id}`);

    const setParams = (params) => {
      transaction = Object.assign(transaction, params.value.transaction);
    };

    const convertDate = (timestamp) => dayjs.unix(timestamp).format('D MMM, HH:mm ');

    return {
      transaction,
      setParams,
      convertDate,
      sumByTickers,
      outLink,
      t,
    };
  },
});
</script>

<style lang="stylus" scoped>
.transaction {
  &__block {
    margin-top: 18px;

    &.flexed {
      display: flex;
      justify-content: space-between;
    }
  }

  &__title {
    opacity: 0.4;
    font-size: 12px;
    margin-bottom: 4px;
  }

  &__text {
    display: flex;
    justify-content: space-between;
  }

  &__sum {
    position: relative;
    font-weight: bold;
    display: flex;
    justify-content: flex-end;
    margin-left: 5px;

    &:after {
      position: absolute;
      z-index: 2;
      top: 0;
      right: 0;
      content: '';
      display: block;
      width: 10px;
      height: 100%;
      background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0, #fff);
    }
  }

  &__amount {
    text-align: right;

    &.sent {
      color: $danger-color;
    }

    &.receive {
      color: $success-color;
    }
  }

  &__ticker {
    width: 52px;
    text-transform: uppercase;
    opacity: 0.4;
    margin-left: 4px;
    overflow: hidden;
  }

  &__put {
    display: flex;
    margin-bottom: 8px;
  }

  &__address {
    flex-shrink: 1;
    flex-grow: 1;
    flex-basis: min-content;
    word-break: break-all;
  }

  &__buttons {
    margin-top: 24px;
  }

  &__button {
    width: 100%;
    text-decoration: none;
    display: block;
    text-align: center;
    color: $dark-color-1;
  }
}
</style>
