<template>
  <div class="transfer">
    <div class="transfer__currency">
      <div class="transfer__currency-title">Currency</div>
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
            {{ key }} <span class="max">(max: {{ cur.balance }})</span>
          </label>
        </div>
      </div>
    </div>
    <div class="transfer__address field">
      <label for="" class="field__label">Address</label>
      <input type="text" class="field__input" v-model="addressModel" />
    </div>
    <div class="transfer__sum field">
      <label for="" class="field__label">Sum</label>
      <input type="text" class="field__input" v-model="sumModel" />
    </div>
    <div class="transfer__sum field">
      <label for="" class="field__label">Secret key</label>
      <input
        type="text"
        class="field__input"
        :class="{ field__input_error: skIsError }"
        v-model="secretKeyModel"
      />
    </div>
    <div class="transfer__fee">Fee: {{ fee }}</div>
    <button class="transfer__button button primary" @click="transfer">
      Transfer {{ transferSum }} {{ currency }}
    </button>
  </div>
</template>

<script>
import Decimal from 'decimal.js';
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { getAddressFromHexSecret } from '@/utils/cryptoKeys';

export default defineComponent({
  components: {
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
      type: String,
      required: true,
    },
    fee: {
      type: String,
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
      currencies: [
        { id: 'OTON' },
        { id: 'USDT' },
      ],
    };
  },
  computed: {
    ...mapState(['walletAddress']),
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
        this.$emit('change-sum', value);
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
      console.info(address, this.walletAddress);
      return address !== this.walletAddress;
    },
    transferSum() {
      if (!+this.sum) {
        return '';
      }
      return Decimal.sum(this.fee || 0, this.sum || 0).toString();
    },
  },

  methods: {
    transfer() {
      this.$emit('transfer');
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
  }

  &__fee {
    margin-top: 8px;
  }

  &__button {
    width: 100%;
    margin-top: 24px;
  }
}
</style>
