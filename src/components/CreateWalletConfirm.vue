<template>
  <div class="confirmation">
    <div class="confirmation__block">
      <div class="confirmation__title">
        <Tr> Your address </Tr>
      </div>
      <div class="confirmation__text">
        {{ keys.pk }}
      </div>
    </div>
    <div class="confirmation__block">
      <div class="confirmation__title">
        <Tr> Secret key </Tr>
      </div>
      <div class="confirmation__text">
        {{ keys.secret }}
      </div>
    </div>
    <div class="confirmation__block">
      <div class="confirmation__title">
        <Tr> Secret Recovery Phrase </Tr>
      </div>
      <div class="confirmation__text">
        {{ keys.mnemonic }}
      </div>
    </div>
    <div class="confirmation__block iconed">
      <div class="confirmation__icon">
        <svg class="confirmation__img">
          <use xlink:href="#ic_copy--sprite" />
        </svg>
      </div>
      <div class="confirmation__box">
        <p>
          <Tr> Copy the address and the key to a safe </Tr>
        </p>
        <BaseCheckbox :name="'copy'" v-model="checks.copy">
          <label class="checkbox__label" for="copy">
            <Tr> I copied </Tr>
          </label>
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
        <p>
          <Tr> Take a picture of the address and the key </Tr>
        </p>
        <BaseCheckbox :name="'picture'" v-model="checks.picture">
          <label class="checkbox__label" for="picture">
            <Tr> I took a picture </Tr>
          </label>
        </BaseCheckbox>
      </div>
    </div>
    <!-- <div class="confirmation__block iconed">
      <div class="confirmation__icon">
        <svg class="confirmation__img">
          <use xlink:href="#ic_print--sprite" />
        </svg>
      </div>
      <div class="confirmation__box">
        <p>
          <Tr> Print the address and the key </Tr>
        </p>
        <BaseCheckbox :name="'copy'" v-model="termsState">
          <label class="checkbox__label" for="copy">
            <Tr> I printed </Tr>
          </label>
        </BaseCheckbox>
      </div>
    </div> -->
    <div class="buttons">
      <button
        class="confirmation__button button primary"
        @click="confirm"
        :disabled="!checks.copy || !checks.picture"
      >
        <Tr> Go </Tr>
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';
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
  emits: ['confirm'],
  setup(props, { emit }) {
    const checks = reactive({
      copy: false,
      picture: false,
    });
    const confirm = () => {
      if (checks.copy && checks.picture) {
        emit('confirm');
      }
    };

    return {
      checks,
      confirm,
    };
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
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: 40px;
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

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  p {
    margin: 0;
    margin-bottom: 8px;
  }
}
</style>
