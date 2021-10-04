<template>
  <DefaultModalLayout :name="name" :title="'Settings'">
    <div class="field">
      <label for="" class="field__label">
        <Tr>Language</Tr>
      </label>
      <select type="text" class="field__selectbox" v-model="locale">
        <option :value="key" v-for="(label, key) in langs" :key="`lang-${key}`">
          {{ label }}
        </option>
      </select>
    </div>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  setup() {
    const langs = reactive({ en: 'English', ru: 'Русский' });
    const { t, locale } = useI18n();

    return {
      langs,
      t,
      locale,
    };
  },
});
</script>

<style lang="stylus" scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  padding-top: 50px;
  padding-bottom: 50px;
  margin: 0 auto;
  display: block;
  text-align: center;
}

.button {
  width: 100%;
  text-align: center;
}
</style>
