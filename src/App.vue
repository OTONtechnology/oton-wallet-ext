<template>
  <div class="main-container">
    <router-view />
  </div>
  <div>
    <ImportWalletModal :name="'ImportWalletModal'" />
    <TransferModal :name="'TransferModal'" />
    <TransferDoneModal :name="'TransferDoneModal'" />
    <TransactionModal :name="'TransactionModal'" />
    <SettingsModal :name="'SettingsModal'" />
    <CreateWalletModal :name="'CreateWalletModal'" />
    <RequestModal :name="'RequestModal'" />
    <ExternalTxModal :name="'ExternalTxModal'" />
  </div>
</template>
<script>
import {
  defineComponent, onBeforeMount, computed, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { $vfm } from 'vue-final-modal';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
import getAddressFromStorage from '@/utils/getAddressFromStorage';
import ImportWalletModal from '@/components/ImportWalletModal.vue';
import TransferModal from '@/components/TransferModal.vue';
import TransferDoneModal from '@/components/TransferDoneModal.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import CreateWalletModal from '@/components/CreateWalletModal.vue';
import RequestModal from '@/components/RequestModal.vue';
import ExternalTxModal from '@/components/ExternalTxModal.vue';
import 'vue-toastification/dist/index.css';
import { getStorageItem } from '@/utils/extension';

export default defineComponent({
  components: {
    ImportWalletModal,
    TransferModal,
    TransferDoneModal,
    TransactionModal,
    SettingsModal,
    CreateWalletModal,
    RequestModal,
    ExternalTxModal,
  },

  setup() {
    const store = useStore();
    const toast = useToast();
    const i18n = useI18n();
    const walletAddress = computed(() => store.state.walletAddress);
    const route = useRoute();

    onBeforeMount(async () => {
      const lang = await getStorageItem('lang', 'sync');

      if (lang !== 'en') {
        i18n.locale.value = lang;
      }

      const address = await getAddressFromStorage();

      const loaderWithAddress = () => {
        const hasReason = route.query.reason;
        if (hasReason === 'customTx') {
          const payload = JSON.parse(route.query.payload);
          const resourceAddress = payload.address;

          if (resourceAddress === address) {
            $vfm.show('ExternalTxModal', {
              transaction: payload.transaction,
              resource: route.query.resource,
              tabId: route.query.tab,
            });
          } else {
            toast.error('Your addresses do not match');
            console.error('addresses do not match');
          }
        }
      };

      const loaderWithoutAddress = () => {
        watch(() => route.query, () => {
          const hasReason = route.query.reason;
          if (hasReason) {
            if (hasReason === 'get_access') {
              store.commit('SET_NEXT_AFTER_AUTH', {
                tab: route.query.tab,
                resource: route.query.resource,
              });
            }
          }
        });
      };

      if (address) {
        loaderWithAddress();
      } else {
        loaderWithoutAddress();
      }
    });

    return {
      walletAddress,
    };
  },
});

</script>
<style lang="stylus">
body {
  color: $dark-color-2;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'PT Root UI', Arial, sans-serif;
  font-size: 14px;
  getFont('text');
  background: $extra-color;

  select, input, textarea {
    font-family: 'PT Root UI', Arial, sans-serif;
    getFont('text');
  }

  *, *::before, &::after {
    box-sizing: border-box;
  }
}

html {
  overflow-x: hidden;
  overflow-y: hidden;
}

svg {
  font-family: 'PT Root UI', Arial, sans-serif;
}

.main-container {
  position: relative;
  min-width: 360px;
  height: 600px;
  margin: 0 auto;
  max-width: 360px;
  // box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  // border-radius: 4px;
  background-color: $extra-color;
}

.button {
  padding: 11px;
  border-radius: 4px;
  border: 2px solid $main-color;
  font-size: 14px;
  font-weight: 700;
  background: none;
  cursor: pointer;
  letter-spacing: normal;
  line-height: normal;
  text-align: center;

  &.primary {
    background: $main-color;
    color: $extra-color;
  }

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.7;
  }
}

.field {
  &__label {
    display: block;
    opacity: 0.4;
    color: $dark-color-2;
    margin-bottom: 4px;
    font-size: 14px;
  }

  &__input {
    width: 100%;
    border-radius: 4px;
    border: 2px solid $fade-color;
    font-size: 14px;
    font-weight: 400;
    padding: 10px 5px;

    &_error {
      border: 2px solid $danger-color;
    }
  }

  &__selectbox {
    display: block;
    width: 100%;
    border-radius: 4px;
    border: 2px solid $fade-color;
    font-size: 14px;
    font-weight: 400;
    padding: 10px 5px;
    background: $extra-color;

    &_error {
      border: 2px solid $danger-color;
    }
  }

  &__error {
    color: $danger-color;
    font-size: 12px;
  }
}

.radio {
  position: relative;

  &__input {
    visibility: hidden;

    &:checked {
      ~ .radio__label {
        &:after {
          position: absolute;
          content: '';
          top: 5px;
          left: -15px;
          width: 8px;
          height: 8px;
          background-color: #5d679c;
          border-radius: 50%;
        }
      }
    }
  }

  &__label {
    position: relative;
    padding-left: 7px;
    font-weight: 700;
    font-size: 14px;

    &:before {
      position: absolute;
      content: '';
      top: 0px;
      left: -20px;
      width: 18px;
      height: 18px;
      border: 2px solid #e7e7e7;
      border-radius: 50%;
    }
  }
}

.wrapper {
  margin-left: 20px;
  margin-right: 20px;
}

.uppercase {
  text-transform: uppercase;
}
</style>
