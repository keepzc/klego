<template>
  <div>
    <template-list :list="testData"></template-list>
  </div>
</template>
<script  lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import TemplateList from '../components/TemplateList.vue';
import { GlobalDataProps } from '../store/index';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'home',
  components: {
    TemplateList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'))
    const testData = computed(() => store.state.templates.data)
    onMounted(() => {
      store.dispatch('fetchTemplates')
    })
    return {
      testData,
      isLoading
    }
  }
})
</script>
<style>

</style>
