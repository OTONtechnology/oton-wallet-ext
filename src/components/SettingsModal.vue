<template>
  <DefaultModalLayout :name="name" :title="'Settings'">
    <div class="field">
      <label for="" class="field__label">Language</label>
      <select type="text" class="field__selectbox" v-model="currentLang">
        <option :value="key" v-for="(label, key) in langs" :key="`lang-${key}`">
          {{ label }}
        </option>
      </select>
    </div>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  setup() {
    const store = useStore();
    const langs = reactive({ en: 'English', ru: 'Русский' });
    const currentLang = computed({
      get: () => store.state.lang,
      set: (value) => store.commit('CHANGE_LANG', value),
    });

    return {
      langs,
      currentLang,
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
