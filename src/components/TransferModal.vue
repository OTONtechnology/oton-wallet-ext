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
    />
    <TransferForm
      v-else
      :currency="form.currency"
      :address="form.address"
      :sum="form.sum"
      @change-currency="changeCurrency"
      @change-address="changeAddress"
      @change-sum="changeSum"
      @transfer="showSubmitForm"
    />
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
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
        currency: 'OTON',
        address: '',
        sum: '',
      },
    };
  },
  props: {
    name: String,
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
    handleClose() {
      this.submitForm = false;
    },
  },
});
</script>

<style lang="stylus"></style>
