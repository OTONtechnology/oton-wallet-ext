<template>
  <DefaultModalLayout :name="name" :title="'Confirm transaction'">
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
          rows="10"
          spellcheck="false"
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
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
// import { $vfm } from 'vue-final-modal';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import { sumInputsUnsignedTx } from '@/utils/sumInputs';

export default defineComponent({
  // name: 'TransferDoneModal',
  components: {
    DefaultModalLayout,
  },
  props: {
    name: String,
  },
  setup() {
    const route = useRoute();
    const showJSON = ref(false);
    const resource = ref(route.query.resource);
    const transaction = {
      code: 0,
      message: 'None',
      data: {
        fee: { name: 'bitboneCoin', amount: '1' },
        inputs: [{
          address: 'HuqdUB4S2sPCsta+UUwAIWzVMaQ=',
          coins: [{ name: 'bitboneCoin', amount: '1' }],
          sequence: '380',
          signature: '7olyjSQXYTLjCrowejqTZARmlxWg2kYjbh2ymhUwSiCy1tXSKCsyl/muManrYw4ukKiXFbmlVlTs/du9S7fVCA==',
          pubKey: '7qXFq0CyhHf5DfO1HbZCnBt3DSZgQ5BFlYWE2Fc/MvU=',
        },
        {
          address: 'TQs8Eh65DoBiPPNsONtungZyLfU=',
          coins: [{ name: 'bitboneCoin', amount: '1' }],
          sequence: '1',
        }],
        address: 'W5znQ9IZcK+tSQ+SFRTdbKPJukc=',
        referal: 'TQs8Eh65DoBiPPNsONtungZyLfU=',
        value: { name: 'TarifBitBone', amount: '299' },
        delta: { name: 'bitboneCoin', amount: '100' },
      },
    };

    const sum = sumInputsUnsignedTx(transaction.data.inputs);
    const address = `${transaction.data.inputs.length} recepients`;

    const { fee } = transaction.data;

    const submitTransfer = () => {
      console.log('confirm');
    };

    const back = () => {
      console.log('back');
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
