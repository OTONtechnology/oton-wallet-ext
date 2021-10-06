<template>
  <div class="confirmation">
    <div class="confirmation__block">
      <div class="confirmation__title">Your address</div>
      <div class="confirmation__text">
        {{ keys.pk }}
      </div>
    </div>
    <div class="confirmation__block">
      <div class="confirmation__title">Secret key</div>
      <div class="confirmation__text">
        {{ keys.secret }}
      </div>
    </div>
    <!-- <div class="confirmation__block">
      <div class="confirmation__title">Secret Recovery Phrase</div>
      <div class="confirmation__text">
        mobile thing property repair sorry spring lamp gasp unhappy surface
        winter problem
      </div>
    </div> -->
    <div class="confirmation__block iconed">
      <div class="confirmation__icon">
        <svg class="confirmation__img">
          <use xlink:href="#ic_copy--sprite" />
        </svg>
      </div>
      <div class="confirmation__box">
        <p>Copy the address and the key to a safe</p>
        <BaseCheckbox :name="'copy'" v-model="termsState">
          <label class="checkbox__label" for="copy"> I copied </label>
        </BaseCheckbox>
      </div>
    </div>
    <div class="confirmation__block iconed">
      <div class="confirmation__icon">
        <svg class="confirmation__img">
          <use xlink:href="#ic_print--sprite" />
        </svg>
      </div>
      <div class="confirmation__box">
        <p>Take a picture of the address and the key</p>
        <BaseCheckbox :name="'copy'" v-model="termsState">
          <label class="checkbox__label" for="copy"> I took a picture </label>
        </BaseCheckbox>
      </div>
    </div>
    <div class="confirmation__block iconed">
      <div class="confirmation__icon">
        <svg class="confirmation__img">
          <use xlink:href="#ic_print--sprite" />
        </svg>
      </div>
      <div class="confirmation__box">
        <p>Print the address and the key</p>
        <BaseCheckbox :name="'copy'" v-model="termsState">
          <label class="checkbox__label" for="copy"> I printed </label>
        </BaseCheckbox>
      </div>
    </div>
    <div class="buttons">
      <button
        class="confirmation__button button primary"
        @click="$emit('confirm')"
      >
        Go
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import '@/assets/svg/ic_copy.svg?sprite';
import '@/assets/svg/ic_print.svg?sprite';

export default defineComponent({
  props: {
    keys: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="stylus" scoped>
.confirmation {
  &__title {
    opacity: 0.4;
  }

  &__text {
    word-break: break-word;
    font-weight: bold;
  }

  &__block {
    margin-bottom: 8px;

    &.iconed {
      margin-top: 16px;
      display: flex;
    }
  }

  &__icon {
    width: 40px;
    display: flex;
    justify-content: center;
  }

  &__img {
    max-width: 26px;
    max-height: 26px;
    margin-top: 2px;
  }

  &__button {
    width: 100%;
    display: block;
    margin-top: 24px;
  }

  p {
    margin: 0;
    margin-bottom: 8px;
  }
}
</style>
