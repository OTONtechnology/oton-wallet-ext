<template>
  <div>
    <CreateWalletPassword v-if="activeView === 'pass'" @create="create" />
    <CreateWalletConfirm :keys="keys" v-else @confirm="confirm" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { $vfm } from 'vue-final-modal';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import CreateWalletPassword from '@/components/CreateWalletPassword.vue';
import CreateWalletConfirm from '@/components/CreateWalletConfirm.vue';
import { createKeys, getAddressFromPubKey } from '../utils/cryptoKeys';
import getAddressFromStorage from '@/utils/getAddressFromStorage';
import { bytesToHex } from '../utils/crypto';
import { importWalletFunc } from '@/utils/auth';

export default defineComponent({
  components: {
    CreateWalletPassword,
    CreateWalletConfirm,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const activeView = ref('pass');
    const keys = ref({
      pk: '',
      secret: '',
      mnemonic: '',
    });
    const form = reactive({});

    const create = async (passForm) => {
      const newKeys = await createKeys();

      form.value = passForm;
      keys.value.pk = getAddressFromPubKey(newKeys.pk);
      keys.value.secret = bytesToHex(newKeys.secret);
      keys.value.mnemonic = newKeys.mnemonic;
      activeView.value = 'confirm';
    };

    const confirm = async () => {
      const { secret } = keys.value;

      const addressInStorage = await importWalletFunc(secret, form.value.password);
      const address = await getAddressFromStorage();

      if (addressInStorage && address) {
        $vfm.hide('CreateWalletModal');
        // console.log(pk);
        store.commit('SET_WALLET_ADDRESS', address);

        if (store.state.nextAfterAuth.tab && store.state.nextAfterAuth.resource) {
          router.push('/permission');
        } else {
          router.push('/home');
        }
      }
    };

    return {
      activeView, create, keys, confirm,
    };
  },
});
</script>

<style lang="stylus" scoped></style>
