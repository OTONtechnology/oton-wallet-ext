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
import { stringToHex, bytesToHex } from '@/utils/crypto';
import vault from '@/utils/vault';

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

      const passHash = stringToHex(form.value.password);
      const putInStorage = await vault.putDataInStorage({ sk: secret }, passHash);

      if (putInStorage.status === 'OK') {
        $vfm.hide('CreateWalletModal');

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
