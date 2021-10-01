<template>
  <div>
    <CreateWalletPassword
      v-if="activeView === 'pass'"
      v-model:password="form.password"
      v-model:password1="form.password1"
      v-model:terms="form.terms"
      @submit="formSubmit"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import CreateWalletPassword from '@/components/CreateWalletPassword.vue';
import { createKeys } from '../utils/cryptoKeys';

export default defineComponent({
  components: {
    CreateWalletPassword,
  },
  setup() {
    let activeView = ref('pass');
    const form = ref({
      password: '',
      password1: '',
      terms: false,
    });

    const switchView = (name) => { activeView = name; };

    const formSubmit = () => {
      console.log('submit');
    };

    const generateKeys = async () => {
      const newKeys = await createKeys();
      return newKeys;
    };
    // TODO: shoud be write to user store, and user should save his secret key

    return {
      form, activeView, switchView, formSubmit,
    };
  },
});
</script>

<style lang="stylus" scoped></style>
