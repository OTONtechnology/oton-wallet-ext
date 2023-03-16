<template>
  <DefaultModalLayout :name="name" :title="'Transfer'" @close-modal="handleClose">
    <div class="loaderBox" v-if="loading">
      <Loader />
    </div>
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

import { find, propEq } from 'rambda';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import TransferForm from '@/components/TransferForm.vue';
import TransferSubmit from '@/components/TransferSubmit.vue';
import Loader from '@/components/Loader.vue';
import { getTrnFromData, signTrn } from '@/utils/transactionSign';
import nodeErrorHandler from '@/utils/nodeErrorHandler';

import vault from '@/utils/vault';

export default defineComponent({
  components: {
    DefaultModalLayout,
    TransferForm,
    TransferSubmit,
    Loader,
  },

  data() {
    return {
      loading: false,
      submitForm: false,
      form: {
        currency: '',
        address: '',
        sum: '',
        fee: 10,
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
      this.form = {
        ...this.form,
        currency: value,
      };
    },
    changeAddress(value) {
      this.form = {
        ...this.form,
        address: value,
      };
    },
    changeSum(value) {
      this.form = {
        ...this.form,
        sum: value,
      };
    },
    changeSk(value) {
      this.form = {
        ...this.form,
        sk: value,
      };
    },
    showSubmitForm() {
      this.submitForm = true;
    },
    showTransferForm() {
      this.submitForm = false;
    },
    async submitTransfer() {
      this.loading = true;
      const toast = useToast();

      if (this.loading) {
        return;
      }

      try {
        const coin = find(propEq('name', this.form.currency))(this.coinsList);
        const localSk = await vault.getDataFromStorage();

        if (!localSk) {
          toast.error('Error! When fetching sk');
          this.loading = false;
          return;
        }

        const preparedTrn = await getTrnFromData(
          { ...this.form },
          this.walletAddress,
          coin.decimal,
        );

        const signedTrn = await signTrn(preparedTrn, localSk);

        const resp = await this.$store.dispatch('sendTransaction', signedTrn);

        if (!resp) {
          toast.error('Error! When sending transaction');
          this.loading = false;
          return;
        }

        if (resp.result.check_tx.code === 0 && resp.result.deliver_tx.code === 0) {
          $vfm.hide('TransferModal');
          $vfm.show('TransferDoneModal');
          this.loading = false;
        } else {
          const errorText = nodeErrorHandler(resp.result);
          toast.error(errorText || 'Error! Something went wrong');
          this.loading = false;
        }
      } catch (e) {
        console.info(e);
        this.loading = false;
        toast.error(e.message);
      }
    },
    handleClose() {
      this.submitForm = false;
      this.form = {
        ...this.form,
        currency: '',
        address: '',
        sum: '',
        fee: 10,
      };
    },
  },
});
</script>

<style lang="stylus">
.loaderBox {
  position absolute
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: rgba($main-color, 0.15);
}
</style>
