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
    <div class="create__block field terms">
      <BaseCheckbox :name="'terms'" v-model="form.terms">
        <label class="checkbox__label" for="terms">
          <Tr> I agree to the Terms of Use </Tr>
        </label>
      </BaseCheckbox>
      <div class="field__errors">
        <div class="field__error" v-for="error in errors.terms" :key="error">
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

<script>
import { defineComponent, reactive } from 'vue';

export default defineComponent({
  emits: ['create'],
  setup(props, { emit }) {
    const errors = reactive({});
    const form = reactive({
      password: '',
      password1: '',
      terms: false,
    });
    const validate = () => {
      errors.terms = [];
      errors.password = [];

      let isValid = true;

      if (!form.terms) {
        errors.terms = ['You must agree with Terms of Use'];
        isValid = false;
      }
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
