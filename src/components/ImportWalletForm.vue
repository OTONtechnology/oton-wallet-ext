<template>
  <div class="import">
    <p class="import__text">Import a wallet with a secret recovery phrase.</p>

    <div class="field">
      <label for="" class="field__label">Address</label>
      <input type="text" class="field__input" v-model="address" />
    </div>
    <!-- <div class="field">
      <label for="" class="field__label">Secret Recovery Phrase</label>
      <input type="text" class="field__input" v-model="phrase" />
    </div> -->

    <!-- <div class="field">
      <label for="" class="field__label">New Password</label>
      <input type="password" class="field__input" v-model="password1" />
    </div>

    <div class="field">
      <label for="" class="field__label">Repeat Password</label>
      <input type="password" class="field__input" v-model="password2" />
    </div> -->

    <div class="field">
      <BaseCheckbox :name="'terms'" :value="terms" @change-value="changeTerms">
        <label class="checkbox__label" for="terms">
          I agree to the Terms of Use
        </label>
      </BaseCheckbox>
    </div>

    <button class="import__button button primary" @click="login">Import</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import extension from 'extensionizer';
import { $vfm } from 'vue-final-modal';

export default defineComponent({
  data() {
    return {
      address: '',

      phrase: '',
      password1: '',
      password2: '',
      terms: false,
    };
  },
  methods: {
    changeTerms(val) {
      this.terms = val;
    },
    login() {
      extension.storage.local.set({ addr: this.address }, () => {
        $vfm.hide('ImportWalletModal');
        this.$router.push({ name: 'Home' });
      });
    },
    check() {
      extension.storage.local.get('addr', (result) => {
        console.log(result);
      });
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
