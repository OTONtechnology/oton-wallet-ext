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
  </div>
</template>
<script>
import { defineComponent, onBeforeMount, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import getAddressFromStorage from '@/utils/getAddressFromStorage';
import ImportWalletModal from '@/components/ImportWalletModal.vue';
import TransferModal from '@/components/TransferModal.vue';
import TransferDoneModal from '@/components/TransferDoneModal.vue';
import TransactionModal from '@/components/TransactionModal.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import CreateWalletModal from '@/components/CreateWalletModal.vue';
import RequestModal from '@/components/RequestModal.vue';
import 'vue-toastification/dist/index.css';

export default defineComponent({
  components: {
    ImportWalletModal,
    TransferModal,
    TransferDoneModal,
    TransactionModal,
    SettingsModal,
    CreateWalletModal,
    RequestModal,
  },

  setup() {
    const store = useStore();
    const walletAddress = computed(() => store.state.walletAddress);
    const router = useRouter();
    const route = useRoute();

    onBeforeMount(async () => {
      const address = await getAddressFromStorage();

      if (address) {
        store.commit('SET_WALLET_ADDRESS', address);
      } else {
        const hasReason = route.query.reason;
        if (hasReason && hasReason === 'get_access') {
          store.commit('SET_NEXT_AFTER_AUTH', {
            tab: route.query.tab,
            resource: route.query.resource,
          });
        }
        router.push('/');
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
