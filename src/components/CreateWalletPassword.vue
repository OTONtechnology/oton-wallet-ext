<template>
  <div class="create">
    <div class="create__block field">
      <label for="" class="field__label">Password</label>
      <input type="password" class="field__input" v-model="passwordState" />
    </div>
    <div class="create__block field">
      <label for="" class="field__label">Repeat Password</label>
      <input type="password" class="field__input" v-model="password1State" />
    </div>
    <div class="create__block field terms">
      <BaseCheckbox :name="'terms'" v-model="termsState">
        <label class="checkbox__label" for="terms">
          I agree to the Terms of Use
        </label>
      </BaseCheckbox>
    </div>

    <div class="buttons">
      <button class="buttons__create button primary" @click="$emit('submit')">
        Create
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import useVModel from '@/utils/useVModel';

export default defineComponent({
  props: {
    password: String,
    password1: String,
    terms: Boolean,
  },
  emits: ['update:password', 'update:password1', 'terms'],
  setup(props) {
    return {
      passwordState: useVModel(props, 'password'),
      password1State: useVModel(props, 'password1'),
      termsState: useVModel(props, 'terms'),
    };
  },
});
</script>

<style lang="stylus" scoped>
.create {
  &__block {
    margin-bottom: 12px;

    &.terms {
      margin-top: 24px;
    }
  }
}

.buttons {
  &__create {
    width: 100%;
  }
}
</style>
