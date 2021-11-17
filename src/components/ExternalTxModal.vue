<template>
  <DefaultModalLayout
    :name="name"
    :title="'Confirm transaction'"
    :unclosable="true"
    @set-params="setParams"
  >
    <div class="form">
      <div class="form__item">
        <div class="form__title">
          <Tr>Site</Tr>
        </div>
        <div class="form__value">{{ resource }}</div>
      </div>
      <div class="form__item">
        <div class="form__title">
          <Tr>Address</Tr>
        </div>
        <div class="form__value">{{ address }}</div>
      </div>
      <div class="form__item">
        <div class="form__title">
          <Tr>Sum</Tr>
        </div>
        <div class="form__value">{{ sum }}</div>
      </div>
      <div class="form__item">
        <div class="form__title" v-if="fee">
          <Tr>Fee</Tr>
        </div>
        <div class="form__value fee">{{ fee.amount }} {{ fee.name }}</div>
      </div>

      <div class="form__hidden" v-if="showJSON" key="hidden-block">
        <div class="form__title">
          <Tr>JSON</Tr>
        </div>
        <textarea
          class="form__json"
          :value="JSON.stringify(transaction)"
          id=""
          cols="30"
          rows="7"
          spellcheck="false"
          readonly="true"
        ></textarea>
      </div>
      <button class="form__showJSON" @click="showJSON = !showJSON">
        <Tr v-if="showJSON">Hide JSON</Tr>
        <Tr v-else>Show JSON</Tr>
      </button>

      <div class="form__buttons">
        <button class="button primary" @click="submitTransfer">Confirm</button>
        <button class="button" @click="back">Cancel</button>
      </div>
    </div>
  </DefaultModalLayout>
</template>

<script>
import {
  defineComponent, ref, reactive, computed,
} from 'vue';
import { isEmpty } from 'rambda';
import { $vfm } from 'vue-final-modal';
import { useStore } from 'vuex';
import extension from 'extensionizer';
import { useToast } from 'vue-toastification';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import { sumInputsUnsignedTx, sumInputsByAddress } from '@/utils/sumInputs';
import { signTrn } from '@/utils/transactionSign';
import { getLocalSecret } from '@/utils/auth';
import maskCoinsAmount from '@/utils/maskCoinsAmount';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  props: {
    name: String,
  },
  setup() {
    const toast = useToast();
    const store = useStore();
    const showJSON = ref(false);
    const walletAddress = computed(() => store.state.walletAddress);
    const resource = ref('');
    const tabId = ref('');
    const transaction = reactive({});
    const coins = computed(() => store.getters['coins/coinsList']);
    const sum = computed(() => (
      isEmpty(transaction.value.fee)
        ? '0'
        : maskCoinsAmount(
          coins.value,
          sumInputsByAddress(transaction.value.inputs, walletAddress.value, false),
          'bitboneCoin',
        )));
    const address = computed(() => (isEmpty(transaction.value.fee) ? '' : `${transaction.value.inputs.length} recepients`));
    const fee = computed(() => (
      isEmpty(transaction.value.fee)
        ? { amount: '', name: '' }
        : {
          ...transaction.value.fee,
          amount: maskCoinsAmount(
            coins.value,
            transaction.value.fee.amount,
            transaction.value.fee.name,
          ),
        }));

    const setParams = (params) => {
      transaction.value = params.value.transaction;
      console.log(params.value.transaction);
      resource.value = params.value.resource;
      tabId.value = params.value.tabId;
    };

    const submitTransfer = async () => {
      if (!isEmpty(transaction.value)) {
        const localSk = await getLocalSecret();
        const testTx = JSON.parse(JSON.stringify(transaction.value));

        const signedTrn = await signTrn(testTx, localSk, 'buy_in_amc');

        const resp = await store.dispatch('sendTransaction', signedTrn);

        if (!resp) {
          return;
        }

        const status = resp.result.check_tx.code === 0 && resp.result.deliver_tx.code === 0;

        if (status) {
          $vfm.hide('ExternalTxModal');
          $vfm.show('TransferDoneModal');
          // extension.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          //   extension.tabs.sendMessage(Number(tabId.value),
          //     { type: 'toContent:customTx', payload: { status, response: resp } });

          //   extension.tabs.getCurrent((tab) => {
          //     extension.tabs.remove(tab.id);
          //   });
          // });
        } else {
          console.info(resp.result);
          toast.error('Error! Something went wrong');
        }
      }
    };

    const back = () => {
      extension.tabs.getCurrent((tab) => {
        extension.tabs.remove(tab.id);
      });
    };

    return {
      transaction,
      resource,
      address,
      sum,
      fee,
      showJSON,
      submitTransfer,
      back,
      setParams,
    };
  },
});
</script>

<style lang="stylus" scoped>
.form {
  margin-top: 10px;

  &__title {
    opacity: 0.4;
  }

  &__value {
    font-weight: 700;
  }

  &__item {
    margin-bottom: 12px;

    &:nth-of-type(3) {
      margin-bottom: 5px;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: column;

    .button {
      width: 100%;
      margin-top: 8px;
    }
  }

  &__showJSON {
    background: none;
    border: none;
    color: #425DF3;
    border-bottom: 1px dotted #425DF3;
    padding: 0;
    margin-bottom: 26px;
  }

  &__json {
    width: 100%;
    border: 2px solid #F2F3F7;
    border-radius: 4px;
    resize: none;
    padding: 10px;
    font-size: 12px;
    color: #1C1B1B;
  }
}
</style>
