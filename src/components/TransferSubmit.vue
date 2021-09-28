<template>
  <div class="form">
    <div class="form__item">
      <div class="form__title">Currency</div>
      <div class="form__value">{{ currency }}</div>
    </div>
    <div class="form__item">
      <div class="form__title">Address</div>
      <div class="form__value">{{ address }}</div>
    </div>
    <div class="form__item">
      <div class="form__title">Sum</div>
      <div class="form__value">{{ sum }}</div>
    </div>
    <div class="form__item">
      <div class="form__title" v-if="fee">Fee</div>
      <div class="form__value fee">{{ fee ? fee : "No fee" }}</div>
    </div>

    <div class="form__buttons">
      <button class="button" @click="back">Back</button>
      <button class="button primary" @click="submitTransfer">
        Accept and Transfer {{ transferSum }} {{ currency }}
      </button>
    </div>
  </div>
</template>

<script>
import Decimal from 'decimal.js';
import { defineComponent } from 'vue';

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
      type: [String, Number],
      required: true,
    },
    fee: {
      type: [String, Number],
      required: false,
    },
  },

  computed: {
    transferSum() {
      if (!+this.sum) {
        return '';
      }
      return Decimal.sum(this.fee || 0, this.sum || 0).toString();
    },
  },

  methods: {
    back() {
      this.$emit('edit-transfer');
    },
    submitTransfer() {
      this.$emit('submit-transfer');
    },
  },
});
</script>

<style lang="stylus" scoped>
.form {
  margin-top: 10px;

  &__title {
    opacity: 0.4;
  }

  &__value {
    font-weight: 700;
  }

  &__item {
    margin-bottom: 12px;

    &:nth-of-type(3) {
      margin-bottom: 5px;
    }
  }

  &__buttons {
    display: flex;
    flex-direction: column;

    .button {
      width: 100%;
      margin-top: 8px;
    }
  }
}
</style>
