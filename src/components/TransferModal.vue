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
      @edit-transfer="showTransferForm"
      @submit-transfer="submitTransfer"
    />
    <TransferForm
      v-else
      :currency="form.currency"
      :address="form.address"
      :sum="form.sum"
      :balances="balances"
      @change-currency="changeCurrency"
      @change-address="changeAddress"
      @change-sum="changeSum"
      @transfer="showSubmitForm"
    />
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import TransferForm from '@/components/TransferForm.vue';
import TransferSubmit from '@/components/TransferSubmit.vue';

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
      },
    };
  },
  props: {
    name: String,
  },
  computed: {
    ...mapState(['balances']),
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
    showSubmitForm() {
      this.submitForm = true;
    },
    showTransferForm() {
      this.submitForm = false;
    },
    submitTransfer() {

    },
    handleClose() {
      this.submitForm = false;
      this.form = {
        currency: '',
        address: '',
        sum: '',
      };
    },
  },
});
</script>

<style lang="stylus"></style>
