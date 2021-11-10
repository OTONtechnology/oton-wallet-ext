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
import { toast } from 'vue-toastification';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import TransferForm from '@/components/TransferForm.vue';
import TransferSubmit from '@/components/TransferSubmit.vue';
import { getTrnFromData, signTrn } from '@/utils/transactionSign';
import { getLocalSecret } from '@/utils/auth';

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
        fee: 0.0001,
        sk: '',
      },
    };
  },
  props: {
    name: String,
  },
  computed: {
    ...mapState(['walletAddress']),
    ...mapGetters({ balances: 'balances/balances' }),
  },
  methods: {
    changeCurrency(value) {
      this.form.currency = value;
    },
    changeAddress(value) {
      this.form.address = value;
    },
    changeSum(value) {
      this.form.sum = value;
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
      const localSk = await getLocalSecret();

      const preparedTrn = await getTrnFromData({ ...this.form }, this.walletAddress);
      const signedTrn = await signTrn(preparedTrn, localSk);

      const resp = await this.$store.dispatch('sendTransaction', signedTrn);

      if (!resp) {
        return;
      }

      if (resp.result.check_tx.code === 0 && resp.result.deliver_tx.code === 0) {
        $vfm.hide('TransferModal');
        $vfm.show('TransferDoneModal');
      } else {
        toast.error('Error! Something went wrong');
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
