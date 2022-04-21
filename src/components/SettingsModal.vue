<template>
  <DefaultModalLayout :name="name" :title="'Settings'">
    <div class="field">
      <label for="" class="field__label">
        <Tr>Language</Tr>
      </label>

      <select
        class="field__selectbox"
        :value="locale || 'en'"
        @change="saveLocale"
      >
        <option :value="key" v-for="(label, key) in langs" :key="`lang-${key}`">
          {{ label }}
        </option>
      </select>
    </div>
  </DefaultModalLayout>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import { setStorageItem } from '@/utils/extension';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  props: {
    name: {
      required: true,
      type: String,
    },
  },
  setup() {
    const langs = { en: 'English', ru: 'Русский', de: 'Deutsch' };
    const { locale } = useI18n({ useScope: 'global' });

    const saveLocale = (e) => {
      locale.value = e.target.value;
      setStorageItem('lang', e.target.value, 'local');
    };

    const currentLocale = computed(() => locale.value);

    console.info(currentLocale.value);
    return {
      langs,
      locale: currentLocale,
      saveLocale,
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
