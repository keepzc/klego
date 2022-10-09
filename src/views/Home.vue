<template>
  <div>
    <template-list :list="testData"></template-list>
  </div>
</template>
<script  lang="ts">
import {defineComponent,computed} from 'vue';
import TemplateList from '../components/TemplateList.vue';
import {GlobalDataProps} from '../store/index';
import {useStore} from 'vuex';

export default defineComponent ({
  name:'home',
  components:{
    TemplateList
  },
  setup(){
    const store = useStore<GlobalDataProps>()
    const testData = computed(()=> store.state.templates.data)
    return {
      testData
    }
  }
})
</script>
<style>
</style>
