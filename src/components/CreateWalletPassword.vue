<template>
  <div class="create">
    <div class="create__block field">
      <label for="" class="field__label">
        <Tr> Password </Tr>
      </label>
      <input type="password" class="field__input" v-model="form.password" />
    </div>
    <div class="create__block field">
      <label for="" class="field__label">
        <Tr> Repeat Password </Tr>
      </label>
      <input type="password" class="field__input" v-model="form.password1" />
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.password" :key="error">
          <Tr>
            {{ error }}
          </Tr>
        </div>
      </div>
    </div>
    <div
      class="create__block field"
      v-for="legal in form.legals"
      :key="legal.name"
      :class="legal.name"
    >
      <BaseCheckbox :name="legal.name" v-model="legal.checked">
        <label class="checkbox__label" :for="legal.name"> I agree to the </label>
        {{ " " }}
        <a class="field__link" target="_blank" :href="legal.link">
          {{ legal.label }}
        </a>
      </BaseCheckbox>
      <div class="field__errors">
        <div class="field__error" v-for="error in errors[legal.name]" :key="error">
          {{ error }}
        </div>
      </div>
    </div>

    <div class="buttons">
      <button class="buttons__create button primary" @click="create">
        <Tr> Create </Tr>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { currentAppConfig } from '@/utils/constants';

export default defineComponent({
  emits: ['create'],
  setup(props, { emit }) {
    const errors: any = reactive({});
    const form = reactive({
      password: '',
      password1: '',
      legals: [
        ...currentAppConfig.legals.map((item) => ({
          ...item, checked: false,
        })),
      ],
    });

    const validate = () => {
      errors.password = [];

      let isValid = true;

      form.legals.forEach(({ label, checked, name }) => {
        errors[name] = [];
        if (!checked) {
          errors[name] = [`You must agree with Terms of Use ${label}`];
          isValid = false;
        }
      });

      if (form.password.length < 6 || form.password1.length < 6) {
        errors.password = ['Password cannot be less than 6 characters'];
        isValid = false;
      } else if (form.password !== form.password1) {
        errors.password = ['Passwords do not match'];
        isValid = false;
      }
      return isValid;
    };
    const create = () => {
      if (validate()) {
        emit('create', form);
      }
    };
    return {
      form,
      errors,
      create,
    };
  },
});
</script>

<style lang="stylus" scoped>
.create {
  &__block {
    margin-bottom: 12px;

    &.terms {
      &:first-of-type {
        margin-top: 24px;
      }
    }
  }
}

.buttons {
  &__create {
    width: 100%;
  }
}
</style>
