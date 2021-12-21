<template>
  <StartLayout>
    <div class="card">
      <!-- <p class="card__text">
        <Tr> Create a new wallet or import an existing one. </Tr>
      </p> -->
      <div class="field">
        <label for="" class="field__label">
          <Tr>Password</Tr>
        </label>
        <input type="password" class="field__input" v-model="password" />
        <div class="field__errors">
          <div class="field__error" v-for="error in errors" :key="error">
            <Tr>
              {{ error }}
            </Tr>
          </div>
        </div>
      </div>

      <div class="card__buttons">
        <button class="card__button button primary" @click="unlock">
          <Tr>Unlock</Tr>
        </button>
      </div>
      <div class="card__links">
        <div class="card__link" @click="handleImport">
          <Tr>Import a wallet</Tr>
        </div>
        <div class="card__link" @click="logout">
          <Tr>Logout</Tr>
        </div>
      </div>
    </div>
  </StartLayout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { $vfm } from 'vue-final-modal';
import { useStore } from 'vuex';
import StartLayout from '@/layouts/StartLayout.vue';
import { getEncryptedSyncKey, decryptCSK, setLocalKey } from '@/utils/auth';
import { clearStorage } from '@/utils/extension';

export default defineComponent({
  components: {
    StartLayout,
  },
  setup() {
    const password = ref('');
    const errors = ref([]);
    const router = useRouter();
    const store = useStore();
    const nextAfterAuth = computed(
      () => !!(store.state.nextAfterAuth.tab && store.state.nextAfterAuth.resource),
    );
    const unlock = async () => {
      errors.value = [];
      const encryptedKey = await getEncryptedSyncKey();
      const decrypted = decryptCSK(encryptedKey, password.value);
      if (decrypted) {
        const setToStorage = await setLocalKey(decrypted);

        if (setToStorage) {
          console.log(123);
          router.push('/home');

          console.log(nextAfterAuth.value);

          if (nextAfterAuth.value) {
            router.push('/permission');
          } else {
            router.push('/home');
          }
        }
      } else {
        errors.value.push('Wrong password');
      }
    };
    const handleImport = () => {
      $vfm.show('ImportWalletModal');
    };

    const logout = async () => {
      const clear = await clearStorage('local');

      if (clear === true) {
        store.commit('CLEAR');
        router.push('/');
      }
    };
    return {
      password,
      errors,
      unlock,
      handleImport,
      logout,
    };
  },

});
</script>

<style lang="stylus" scoped>
.card {
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: $extra-color;
  margin: 0 12px;
  padding: 16px 16px 24px 16px;
  margin-top: 380px;

  &__text {
    color: var(--dark-color-2);
    margin-bottom: 16px;
    font-size: 14px;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    width: 100%;
    margin-top: 16px;
  }

  &__links {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
  }

  &__link {
    text-decoration: underline;
    color: $main-color;
    cursor: pointer;
  }
}
</style>
