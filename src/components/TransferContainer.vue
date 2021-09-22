<template>
  <div>
    <TransferSubmit
      v-if="submitForm"
      :currency="form.currency"
      :address="form.address"
      :sum="form.sum"
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
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import TransferForm from '@/components/TransferForm.vue';
import TransferSubmit from '@/components/TransferSubmit.vue';

export default defineComponent({
  components: {
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
  },
  unmounted() {
    console.log(123123);
  },

});
</script>
