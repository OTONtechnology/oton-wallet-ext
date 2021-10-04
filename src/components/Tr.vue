<template>
  <span :key="randomKey">
    {{ phrase }}
  </span>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  setup(props, context) {
    const { t, locale } = useI18n();
    const phrase = computed(() => t(context.slots.default()[0].children));
    const randomKey = computed(() => Math.random()
      .toString(36)
      .substring(7));

    return {
      phrase,
      randomKey,
      locale,
    };
  },
});
</script>

<style>
</style>
