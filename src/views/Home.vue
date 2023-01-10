<template>
  <div>
    <template-list :list="testData"></template-list>
  </div>
</template>
<script  lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import axios from 'axios'
import { message } from 'ant-design-vue'
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
    const currentUser = computed(() => store.state.user)
    const testData = computed(() => store.state.templates.data)
    onMounted(() => {
      store.dispatch('fetchTemplates')
      if (!currentUser.value.isLogin && currentUser.value.token) {
        axios.defaults.headers.common.Authorization = `Bearer ${currentUser.value.token}`
        store.dispatch('fetchCurrentUser').catch(() => {
          message.error('登录状态已过期 请重新登录', 2)
          localStorage.removeItem('token')
          delete axios.defaults.headers.common.Authorization
        })
      }
      currentUser
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
