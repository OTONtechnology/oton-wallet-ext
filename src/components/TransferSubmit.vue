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
      <div class="form__value fee">{{ fee ? fee : "No fee" }}</div>
    </div>

    <div class="form__buttons">
      <button class="button" @click="back">Back</button>
      <button class="button primary">
        Accept and Transfer {{ sum }} {{ currency }}
      </button>
    </div>
  </div>
</template>

<script>
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
      type: String,
      required: true,
    },
    fee: {
      type: String,
      required: false,
    },
  },

  methods: {
    submitTransfer() {
      this.$emit('transfer-submit');
    },
    back() {
      this.$emit('edit-transfer');
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
