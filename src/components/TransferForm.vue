<template>
  <div class="transfer">
    <div class="transfer__currency">
      <div class="transfer__currency-title">
        <Tr> Currency </Tr>
      </div>
      <div class="transfer__currencies-list">
        <div
          class="transfer__radio radio"
          v-for="(cur, key) in balances"
          :key="key"
        >
          <input
            type="radio"
            class="radio__input"
            :value="key"
            :id="key"
            v-model="currencyModel"
          />
          <label class="radio__label" :for="key">
            {{ key }} <span class="max">(<Tr>max</Tr>: {{ cur.balance }})</span>
          </label>
        </div>
      </div>
      <EmptyState v-if="noBalances">
        <Tr>No currencies</Tr>
      </EmptyState>
      <div class="field__errors" v-if="!noBalances">
        <div class="field__error" v-for="error in errors.currency" :key="error">
          <Tr>
            {{ error }}
          </Tr>
        </div>
      </div>
    </div>
    <div class="transfer__address field">
      <label for="" class="field__label">
        <Tr> Address </Tr>
      </label>
      <input type="text" class="field__input" v-model="addressModel" />
      <QrScanner @scanned="scanned" class="transfer__scanIcon"/>
    </div>
    <div class="field__errors">
      <div class="field__error" v-for="error in errors.address" :key="error">
        <Tr>
          {{ error }}
        </Tr>
      </div>
    </div>
    <div class="transfer__sum field">
      <label for="" class="field__label">
        <Tr> Sum </Tr>
      </label>
      <input type="number" class="field__input" v-model="sumModel" />
    </div>
    <div class="field__errors">
      <div class="field__error" v-for="error in errors.sum" :key="error">
        <Tr>
          {{ error }}
        </Tr>
      </div>
    </div>
    <div class="transfer__fee"><Tr>Fee</Tr>: {{ fee }} OTON</div>
    <button class="transfer__button button primary" @click="transfer">
      <Tr
        :settings="{
          transferSum,
          currency: `${currency}`.toUpperCase(),
        }"
      >
        Transfer {transferSum} {currency}
      </Tr>
    </button>
  </div>
</template>

<script>
import Decimal from 'decimal.js';
import { defineComponent } from 'vue';
import { mapState, mapGetters } from 'vuex';
import { find, propEq } from 'rambda';
import { getAddressFromHexSecret } from '@/utils/cryptoKeys';
import EmptyState from '@/components/EmptyState.vue';
import QrScanner from '@/components/QrScanner.vue';
import generateDecimalNumber from '@/utils/generateDecimalNumber';

export default defineComponent({
  components: {
    EmptyState,
    QrScanner,
  },
  props: {
    currency: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    sum: {
      type: [String, Number],
      required: true,
    },
    fee: {
      type: [String, Number],
      required: true,
    },
    sk: {
      type: String,
      required: true,
    },
    balances: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      errors: {
        currency: [],
        address: [],
        sum: [],
        sk: [],
      },
    };
  },
  computed: {
    ...mapState(['walletAddress']),
    ...mapGetters({
      pending: 'balances/pending',
      noBalances: 'balances/balancesIsEmpty',
      coinsList: 'coins/coinsList',
    }),

    currencyModel: {
      get() {
        return this.currency;
      },
      set(value) {
        this.$emit('change-currency', value);
      },
    },
    addressModel: {
      get() {
        return this.address;
      },
      set(value) {
        this.$emit('change-address', value);
      },
    },
    sumModel: {
      get() {
        return this.sum;
      },
      set(value) {
        this.$emit('change-sum', Number(value.toString().replace(',', '.')));
      },
    },
    secretKeyModel: {
      get() {
        return this.sk;
      },
      set(value) {
        this.$emit('change-sk', value);
      },
    },
    skIsError() {
      const address = getAddressFromHexSecret(this.sk);
      if (this.sk === '') {
        return false;
      }

      return address !== this.walletAddress;
    },
    transferSum() {
      if (!+this.sum) {
        return '';
      }
      return Decimal.sum(this.sum || 0).toString();
    },
  },

  methods: {
    scanned(value) {
      if (!value || typeof value !== 'string') {
        this.errors.address.push('Wrong address');
        return;
      }

      const address = value.replace(/^0x/i, '');

      if (address.length !== 40 || address === this.walletAddress) {
        this.errors.address.push('Wrong address');
        return;
      }

      this.addressModel = address;
    },
    async transfer() {
      if (this.validate()) {
        this.$emit('transfer');
      }
    },
    validate() {
      this.errors = {
        currency: [],
        address: [],
        sum: [],
        sk: [],
      };
      let hasErrors = false;

      if (!this.currency) {
        this.errors.currency.push('Select currency');
        hasErrors = true;
      }

      if (!this.address || this.address.length !== 40 || this.address === this.walletAddress) {
        this.errors.address.push('Wrong address');
        hasErrors = true;
      }

      if (!Number(this.sum)) {
        this.errors.sum.push('Wrong sum');

        hasErrors = true;
      } else {
        const coin = find(propEq('name', this.currency))(this.coinsList);
        const min = generateDecimalNumber(coin.decimal);

        if (Number(this.sumModel) < min) {
          this.errors.sum.push(`Minimum amount for this currency: ${min}`);
          hasErrors = true;
        }
      }

      return !hasErrors;
    },
  },
});
</script>

<style lang="stylus" scoped>
.transfer {
  &__currency-title {
    opacity: 0.4;
    color: $dark-color-2;
    font-size: 14px;
  }

  &__radio {
    margin-top: 4px;

    .radio__label {
      text-transform: uppercase;
    }

    .max {
      font-weight: 400;
      text-transform: lowercase;
    }
  }

  &__address, &__sum {
    margin-top: 12px;
    position: relative;
  }
  &__address {
    input {
      padding-right: 32px;
    }
  }
  &__scanIcon {
    position absolute
    bottom: 11px;
    right: 10px;
    width 20px
    height 20px
  }

  &__fee {
    margin-top: 8px;
  }

  &__button {
    width: 100%;
    margin-top: 24px;
  }
}

input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>
