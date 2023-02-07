<template>
  <div class="content-container">
    <a-row :gutter="16">
      <template-list :list="testData"></template-list>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large" @click="loadMorePage" v-if="!isLastPage"
        :loading="isLoading">加载更多</a-button>
    </a-row>

  </div>

</template>
<script  lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import TemplateList from '../components/TemplateList.vue';
import { GlobalDataProps } from '../store/index';
import { useStore } from 'vuex';
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'home',
  components: {
    TemplateList
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const isLoading = computed(() => store.getters.isOpLoading('fetchTemplates'))
    const testData = computed(() => store.state.templates.data)
    const total = computed(() => store.state.templates.totalTemplates)
    const { loadMorePage, isLastPage } = useLoadMore('fetchTemplates', total, { pageIndex: 0, pageSize: 4 })
    onMounted(() => {
      store.dispatch('fetchTemplates', { searchParams: { pageIndex: 0, pageSize: 4 } })
      // 使用 loadMorePage 非常容易就实现了一个下拉加载
      // window.addEventListener('scroll', (e) => {
      //   // get body height
      //   const totalPageHeight = document.body.scrollHeight
      //   // get scrollPoint
      //   const scrollPoint = window.scrollY + window.innerHeight
      //   if (scrollPoint >= totalPageHeight && !isLastPage.value) {
      //     loadMorePage()
      //   }
      // })
    })
    return {
      testData,
      isLoading,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
<style>

</style>
