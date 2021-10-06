<template>
  <DefaultModalLayout
    :name="name"
    :title="'Transaction'"
    @set-params="setParams"
  >
    <!-- <div class="transaction" v-if="transaction">
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
          {{ sum }} (included {{ transaction.fee.amount }} fee)
        </div>
      </div>
      <div class="transaction__block">
        <div class="transaction__title">Type</div>
        <div class="transaction__text">
          {{ transaction.type }}
        </div>
      </div>
    </div> -->
    <div class="transaction">
      <div class="transaction__block flexed">
        <div>
          <div class="transaction__title">{{ t("Date and Time") }}</div>
          <div class="transaction__text">
            {{ convertDate(transaction.block.timestamp) }}
          </div>
        </div>
        <div>
          <div class="transaction__title">{{ t("Type") }}</div>
          <div class="transaction__text">
            {{ transaction.type }}
          </div>
        </div>
        <div>
          <div class="transaction__title">{{ t("Total") }}</div>
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
        <div class="transaction__title">{{ t("Senders") }}</div>
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
        <div class="transaction__title">{{ t("Recepients") }}</div>
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
          <div class="transaction__address">n/a</div>
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
    const outLink = computed(() => `https://otn-explorer.pages.dev/transaction/${transaction.id}`);

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
    overflow: hidden;
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
