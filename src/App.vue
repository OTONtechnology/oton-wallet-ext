<template>
  <svg class="qrCode__close" @click="destroyQrCode" v-if="isTransparentContent">
    <use xlink:href="#ic_close--sprite" />
  </svg>
  <div class="main-container" :class="{ hideContent: isTransparentContent }">
    <router-view />
  </div>
  <div :class="{ hideContent: isTransparentContent }">
    <ImportWalletModal :name="'ImportWalletModal'" />
    <TransferModal :name="'TransferModal'" />
    <TransferDoneModal :name="'TransferDoneModal'" />
    <TransactionModal :name="'TransactionModal'" />
    <SettingsModal :name="'SettingsModal'" />
    <PrivateKeyModal :name="'PrivateKeyModal'" />
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
import ImportWalletModal from '@/components/ImportWalletModal.vue';
import TransferModal from '@/components/TransferModal.vue';
import TransferDoneModal from '@/components/TransferDoneModal.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import PrivateKeyModal from '@/components/PrivateKeyModal.vue';
import CreateWalletModal from '@/components/CreateWalletModal.vue';
import RequestModal from '@/components/RequestModal.vue';
import ExternalTxModal from '@/components/ExternalTxModal.vue';
import 'vue-toastification/dist/index.css';
import { getStorageItem } from '@/utils/extension';
import vault from '@/utils/vault';

import '@/assets/svg/logo.svg?sprite';
import '@/assets/svg/ic_logo.svg?sprite';
import '@/assets/svg/fc-logo.svg?sprite';
import '@/assets/svg/ic_fc-logo.svg?sprite';

export default defineComponent({
  components: {
    ImportWalletModal,
    TransferModal,
    TransferDoneModal,
    TransactionModal,
    SettingsModal,
    PrivateKeyModal,
    CreateWalletModal,
    RequestModal,
    ExternalTxModal,
  },

  setup() {
    const store = useStore();
    const toast = useToast();
    const i18n = useI18n();
    const walletAddress = computed(() => store.state.walletAddress);
    const isTransparentContent = computed(() => store.state.isTransparentContent);
    const route = useRoute();

    onBeforeMount(async () => {
      // const initVault = await vault.init();
      const lang = await getStorageItem('lang', 'local');

      if (lang !== 'en') {
        i18n.locale.value = lang;
      }

      const address = await vault.getAddress();

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

      if (address === 'expired') {
        loaderWithoutAddress();
      } else if (address) {
        loaderWithAddress();
      } else {
        loaderWithoutAddress();
      }
    });

    const destroyQrCode = () => {
      store.commit('SET_TRANSPARENT', false);
      window.QRScanner.pausePreview();
      window.QRScanner.destroy();
    };

    return {
      walletAddress,
      isTransparentContent,
      destroyQrCode,
    };
  },
});

</script>

<style lang="stylus" scoped>
.hideContent {
  opacity: 0;
  pointer-events: none;
}
  .qrCode__close {
    position: fixed;
    width: 50px;
    height: 50px;
    top: 30px;
    right: 30px;
    background: none;
    margin: 0;
    padding: 0;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
</style>
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
  overflow-x: auto;
  overflow-y: auto;
}

.html-bg-transparent {
  background-color: transparent;

  *, *::before, &::after {
    background-color: transparent;
  }
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
  display: flex;
  justify-content: center;
  overflow: auto;
}

.button {
  padding: 11px 8px;
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

  &__link {
    color: $main-color;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      opacity: 0.8;
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
