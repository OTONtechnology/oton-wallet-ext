<template>
  <div class="import">
    <p class="import__text">Import a wallet with a secret recovery phrase.</p>

    <div class="field">
      <label for="" class="field__label">Secret Key</label>
      <input type="text" class="field__input" v-model="phrase" />
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.phrase" :key="error">
          {{ error }}
        </div>
      </div>
    </div>
    <div class="field">
      <label for="" class="field__label">New Password</label>
      <input type="password" class="field__input" v-model="password1" />
    </div>

    <div class="field">
      <label for="" class="field__label">Repeat Password</label>
      <input type="password" class="field__input" v-model="password2" />
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.password" :key="error">
          {{ error }}
        </div>
      </div>
    </div>

    <div class="field">
      <BaseCheckbox :name="'terms'" :value="terms" @change-value="changeTerms">
        <label class="checkbox__label" for="terms">
          I agree to the Terms of Use
        </label>
      </BaseCheckbox>
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.terms" :key="error">
          {{ error }}
        </div>
      </div>
    </div>

    <button class="import__button button primary" @click="login">Import</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
// import extension from 'extensionizer';
// import { getStorageItem } from '@/utils/extension';
import { $vfm } from 'vue-final-modal';
import { importWalletFunc, getLocalSecret } from '@/utils/auth';

export default defineComponent({
  data() {
    return {
      phrase: '9275b1960378420c0867a7c341389fe882fd64d03c80543f06b074399daa1c7ac295706afdc968bd8cac54155c01bc190179b0beffcdfb8814d8b8ce763d16ee',
      password1: '123123',
      password2: '123123',
      terms: true,

      errors: {},
    };
  },
  methods: {
    changeTerms(val) {
      this.terms = val;
    },
    async login() {
      if (this.validate()) {
        const secret = this.phrase;

        const addressInStorage = await importWalletFunc(secret, this.password1);

        if (addressInStorage === true) {
          $vfm.hide('ImportWalletModal');
          this.$router.push({ name: 'Home' });
        }
      }
    },

    validate() {
      let isValid = true;
      if (!this.terms) {
        this.errors.terms = ['You must agree with Terms of Use'];
        isValid = false;
      }
      if (this.password1.length < 6 || this.password2.length < 6) {
        this.errors.password = ['Password cannot be less than 6 characters'];
        isValid = false;
      } else if (this.password1 !== this.password2) {
        this.errors.password = ['Passwords do not match'];
        isValid = false;
      }
      if (this.phrase.length !== 128) {
        this.errors.phrase = ['Secret key length not valid'];
        isValid = false;
      }

      return isValid;
    },
  },
});
</script>

<style lang="stylus" scoped>
.import {
  &__text {
    color: $dark-color-2;
    font-size: 14px;
    font-weight: 300;
  }

  &__button {
    width: 100%;
    margin-top: 16px;
    ffont-size: 16px;
  }
}

.field {
  margin-top: 14px;
}
</style>
