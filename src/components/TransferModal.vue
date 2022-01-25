<template>
  <DefaultModalLayout
    :name="name"
    :title="'Transfer'"
    @close-modal="handleClose"
  >
    <TransferSubmit
      v-if="submitForm"
      :currency="form.currency"
      :address="form.address"
      :sum="form.sum"
      :fee="form.fee"
      @edit-transfer="showTransferForm"
      @submit-transfer="submitTransfer"
    />
    <TransferForm
      v-else
      :currency="form.currency"
      :address="form.address"
      :sum="form.sum"
      :fee="form.fee"
      :balances="balances"
      :sk="form.sk"
      @change-currency="changeCurrency"
      @change-address="changeAddress"
      @change-sum="changeSum"
      @change-sk="changeSk"
      @transfer="showSubmitForm"
    />
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState, mapGetters } from 'vuex';
import { $vfm } from 'vue-final-modal';
import { useToast } from 'vue-toastification';
import Decimal from 'decimal.js';
import { find, propEq } from 'rambda';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import TransferForm from '@/components/TransferForm.vue';
import TransferSubmit from '@/components/TransferSubmit.vue';
import { getTrnFromData, signTrn } from '@/utils/transactionSign';
import nodeErrorHandler from '@/utils/nodeErrorHandler';
import generateDecimalNumber from '@/utils/generateDecimalNumber';
import vault from '@/utils/vault';

export default defineComponent({
  components: {
    DefaultModalLayout,
    TransferForm,
    TransferSubmit,
  },

  data() {
    return {
      submitForm: false,
      form: {
        currency: '',
        address: '',
        sum: '',
        fee: 0,
        sk: '',
      },
    };
  },
  props: {
    name: String,
  },
  computed: {
    ...mapState(['walletAddress']),
    ...mapGetters({ balances: 'balances/balances', coinsList: 'coins/coinsList' }),
  },
  methods: {
    changeCurrency(value) {
      this.form.currency = value;

      if (this.form.sum) {
        this.changeFee(this.form.sum);
      }
    },
    changeAddress(value) {
      this.form.address = value;
    },
    changeSum(value) {
      this.form.sum = value;
      this.changeFee(value);
    },
    changeFee(value) {
      const coin = find(propEq('name', this.form.currency))(this.coinsList);

      if (coin) {
        const fromSum = Decimal.mul(value, 0.01).toFixed();
        const min = generateDecimalNumber(coin.decimal);
        this.form.fee = fromSum > min ? fromSum : min;
      } else {
        this.form.fee = 0;
      }
    },
    changeSk(value) {
      this.form.sk = value;
    },
    showSubmitForm() {
      this.submitForm = true;
    },
    showTransferForm() {
      this.submitForm = false;
    },
    async submitTransfer() {
      const toast = useToast();

      const coin = find(propEq('name', this.form.currency))(this.coinsList);
      const localSk = await vault.getDataFromStorage();

      if (!localSk) {
        toast.error('Error! Whe fetching sk');
      }

      const preparedTrn = await getTrnFromData({ ...this.form }, this.walletAddress, coin.decimal);

      const signedTrn = await signTrn(preparedTrn, localSk);

      const resp = await this.$store.dispatch('sendTransaction', signedTrn);

      if (!resp) {
        return;
      }

      if (resp.result.check_tx.code === 0 && resp.result.deliver_tx.code === 0) {
        $vfm.hide('TransferModal');
        $vfm.show('TransferDoneModal');
      } else {
        const errorText = nodeErrorHandler(resp.result);
        toast.error(errorText || 'Error! Something went wrong');
      }
    },
    handleClose() {
      this.submitForm = false;
      this.form = {
        ...this.form,
        currency: '',
        address: '',
        sum: '',
      };
    },
  },
});
</script>

<style lang="stylus"></style>
