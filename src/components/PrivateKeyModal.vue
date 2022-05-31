<template>
  <DefaultModalLayout :name="name" :title="'Private key'" @close-modal="clearData">
    <template v-if="!isOpenedKey">
      <div class="field">
        <label for="" class="field__label">
          <Tr>Wallet password</Tr>
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

      <button class="button primary" @click="submitPass">
        <Tr>Show private key</Tr>
      </button>
    </template>

    <template v-else>
      <div class="field">
        <label for="" class="field__label">
          <Tr>Private key</Tr>
        </label>
        <div class="privateKey">{{ sk }}</div>
      </div>

      <button class="button" @click="onCopy">
        <Tr>Copy</Tr>
      </button>
    </template>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent, ref } from 'vue';

import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { copyText } from 'vue3-clipboard';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import { stringToHex } from '@/utils/crypto';
import vault from '@/utils/vault';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  props: {
    name: {
      required: true,
      type: String,
    },
  },

  setup() {
    const { t } = useI18n();
    const toast = useToast();

    const isOpenedKey = ref(false);
    const password = ref('');
    const errors = ref([]);
    const sk = ref('');

    const submitPass = async () => {
      errors.value = [];
      const passHash = stringToHex(password.value);
      const isValid = await vault.checkPassword(passHash);

      if (isValid.status === 'OK') {
        sk.value = await vault.getDataFromStorage();
        isOpenedKey.value = true;
      } else {
        errors.value.push('Wrong password');
      }
    };
    const onCopy = () => {
      copyText(sk.value, undefined, (error) => {
        if (error) {
          console.error('Copy error');
          toast.error(t('Error!'), {
            timeout: 2000,
          });
        } else {
          toast.success(t('Copied!'), {
            timeout: 2000,
          });
        }
      });
    };

    const clearData = () => {
      isOpenedKey.value = false;
      password.value = '';
      errors.value = [];
      sk.value = '';
    };

    return {
      isOpenedKey,
      password,
      errors,
      sk,
      onCopy,
      clearData,
      submitPass,
    };
  },
});
</script>

<style lang="stylus" scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  padding-top: 50px;
  padding-bottom: 50px;
  margin: 0 auto;
  display: block;
  text-align: center;
}

.button {
  margin-top 14px;
  width: 100%;
  text-align: center;
}
.privateKey {
  font-size 14px
  word-wrap: break-word;
  color: #1C1B1B;
  font-weight 700;
}
</style>
