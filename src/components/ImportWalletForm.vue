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

    <div
      class="field"
      v-for="legal in legals"
      :key="legal.name"
    >
      <BaseCheckbox :name="legal.name" v-model="legal.checked">
        <label class="checkbox__label" :for="legal.name">
          <Tr> I agree to the </Tr>
        </label>
        {{ " " }}
        <a class="field__link" target="_blank" :href="legal.link">
          {{ legal.label }}
        </a>
      </BaseCheckbox>
      <div class="field__errors">
        <div class="field__error" v-for="error in errors[legal.name]" :key="error">
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
import { currentAppConfig } from '@/utils/constants';

export default defineComponent({
  data() {
    return {
      phrase: '',
      password1: '',
      password2: '',
      legals: [
        ...currentAppConfig.legals.map((item) => ({
          ...item, checked: false,
        })),
      ],
      errors: {},
    };
  },
  computed: {
    nextAfterAuth() {
      const { tab, resource } = this.$store.state.nextAfterAuth;
      return !!(tab && resource);
    },
  },
  methods: {
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
        password: [],
        phrase: [],
      };

      if (typeof this.phrase !== 'string') {
        this.errors.phrase.push('Secret key is not valid');
        return false;
      }

      const phrase = this.getNormalizePhrase();
      const isRecoveryPhrase = this.checkIsMnemonic();

      this.legals.forEach(({ label, checked, name }) => {
        this.errors[name] = [];
        if (!checked) {
          this.errors[name] = [`You must agree with ${label}`];
        }
      });

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
      } else if (phrase.length !== 128 && phrase.length !== 64) {
        this.errors.phrase = ['Secret key length not valid'];
      }

      let result = 0;

      Object.values(this.errors).forEach((item) => {
        if (Array.isArray(item)) {
          result += item.length;
        }
      });

      return result === 0;
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
