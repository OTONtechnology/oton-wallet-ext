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
import { createKeys } from '../utils/cryptoKeys';
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
      keys.value.pk = bytesToHex(newKeys.pk);
      keys.value.secret = bytesToHex(newKeys.secret);
      keys.value.mnemonic = newKeys.mnemonic;

      activeView.value = 'confirm';
    };

    const confirm = async () => {
      const { secret } = keys.value;

      const addressInStorage = await importWalletFunc(secret, form.value.password);

      if (addressInStorage === true) {
        $vfm.hide('CreateWalletModal');

        if (store.state.nextAfterAuth.tab && store.state.nextAfterAuth.resource) {
          this.$router.push({ name: 'Permission' });
        } else {
          router.push({ name: 'Home' });
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
