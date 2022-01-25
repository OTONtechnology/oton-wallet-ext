<template>
  <div class="import">
    <p class="import__text">
      <Tr> Import a wallet with a secret recovery phrase. </Tr>
    </p>

    <div class="field">
      <label for="" class="field__label">
        <Tr> Secret Key or Secret Recovery Phrase </Tr>
      </label>
      <input type="text" class="field__input" v-model="phrase" />
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.phrase" :key="error">
          <Tr>
            {{ error }}
          </Tr>
        </div>
      </div>
    </div>
    <div class="field">
      <label for="" class="field__label">
        <Tr> New Password </Tr>
      </label>
      <input type="password" class="field__input" v-model="password1" />
    </div>

    <div class="field">
      <label for="" class="field__label">
        <Tr> Repeat Password </Tr>
      </label>
      <input type="password" class="field__input" v-model="password2" />
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.password" :key="error">
          <Tr>
            {{ error }}
          </Tr>
        </div>
      </div>
    </div>

    <div class="field">
      <BaseCheckbox :name="'terms'" v-model="terms">
        <label class="checkbox__label" for="terms">
          <Tr> I agree to the </Tr>
        </label>
        {{ " " }}
        <a class="field__link" target="_blank" :href="termsLink">
          Terms of Use
        </a>
      </BaseCheckbox>
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.terms" :key="error">
          <Tr>
            {{ error }}
          </Tr>
        </div>
      </div>
    </div>
    <div class="field">
      <BaseCheckbox :name="'privacy'" v-model="privacy">
        <label class="checkbox__label" for="privacy">
          <Tr> I agree to the </Tr>
        </label>
        {{ " " }}
        <a class="field__link" target="_blank" :href="privacyLink">
          Privacy Policy
        </a>
      </BaseCheckbox>
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.privacy" :key="error">
          <Tr>
            {{ error }}
          </Tr>
        </div>
      </div>
    </div>

    <button class="import__button button primary" @click="login">
      <Tr> Import </Tr>
    </button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { $vfm } from 'vue-final-modal';
import { mnemonicToEntropy } from 'bip39';
import { stringToHex, bytesToHex } from '@/utils/crypto';
import vault from '@/utils/vault';
import { getKeysFromHexSK } from '@/utils/cryptoKeys';

export default defineComponent({
  data() {
    return {
      phrase: '',
      password1: '',
      password2: '',
      terms: false,
      privacy: false,
      errors: {},
    };
  },
  computed: {
    nextAfterAuth() {
      return !!(this.$store.state.nextAfterAuth.tab && this.$store.state.nextAfterAuth.resource);
    },
    termsLink() {
      const domain = process.env.VUE_APP_LEGALS_URL;
      return `${domain}/OTONWallet_TermsOfUse.pdf`;
    },
    privacyLink() {
      const domain = process.env.VUE_APP_LEGALS_URL;
      return `${domain}/OTONWallet_PrivacyPolicy.pdf`;
    },
  },
  methods: {
    changeTerms(val) {
      this.terms = val;
    },
    async login() {
      if (this.validate()) {
        let secret = this.getNormalizePhrase();

        if (this.checkIsMnemonic()) {
          secret = mnemonicToEntropy(secret);
        }

        const keys = await getKeysFromHexSK(secret);
        const hexSecretKey = bytesToHex(keys.secret);

        const passHash = stringToHex(this.password1);
        const putInStorage = await vault.putDataInStorage({ sk: hexSecretKey }, passHash);

        if (putInStorage.status === 'OK') {
          this.$store.commit('SET_WALLET_ADDRESS', vault.getAddress());
          $vfm.hide('ImportWalletModal');

          if (this.nextAfterAuth) {
            this.$router.push('/permission');
          } else {
            this.$router.push('/home');
          }
        }
      }
    },

    getNormalizePhrase() {
      return this.phrase.replace(/\s+/g, ' ').trim();
    },

    checkIsMnemonic() {
      return this.getNormalizePhrase().includes(' ');
    },

    validate() {
      this.errors = {
        terms: [],
        privacy: [],
        password: [],
        phrase: [],
      };

      if (typeof this.phrase !== 'string') {
        this.errors.phrase.push('Secret key is not valid');
        return false;
      }

      const phrase = this.getNormalizePhrase();
      const isRecoveryPhrase = this.checkIsMnemonic();

      if (!this.terms) {
        this.errors.terms.push('You must agree with Terms of Use');
      }
      if (!this.privacy) {
        this.errors.privacy.push('You must agree with Privacy Policy');
      }
      if (this.password1.length < 6 || this.password2.length < 6) {
        this.errors.password = ['Password cannot be less than 6 characters'];
      }
      if (this.password1 !== this.password2) {
        this.errors.password = ['Passwords do not match'];
      }

      if (isRecoveryPhrase) {
        if (phrase.split(' ').length !== 24) {
          this.errors.phrase.push('Secret Recovery Phrase length not valid');
        } else {
          try {
            mnemonicToEntropy(phrase);
          } catch (e) {
            this.errors.phrase.push(e.message);
          }
        }
      } else if (phrase.length !== 128) {
        this.errors.phrase = ['Secret key length not valid'];
      }

      const {
        terms,
        privacy,
        password,
        phrase: errorPhrase,
      } = this.errors;

      return (terms.length + privacy.length + password.length + errorPhrase.length) === 0;
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
