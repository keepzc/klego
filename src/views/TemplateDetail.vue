<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center" v-if="template">
      <a-col :span="8" class="cover-img">
        <img :src="template.coverImg" alt="">
      </a-col>
      <a-col :span="8">
        <h2>{{template.title}}</h2>
        <p>{{template.title}}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          模板由<b>{{template.author}}</b>创建
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <div ref="container"></div>
        </div>
        <div class="use-btn">
          <router-link to="/editor">
            <a-button type="primary" size="large">
              使用模板
            </a-button>
          </router-link>
          <a-button size="large" class="load-btn">
              下载图片海报
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent,computed } from 'vue';
import {useRoute} from 'vue-router'
import {useStore} from 'vuex'
import {GlobalDataProps} from '../store/index'
import {TemplateProps} from '../store/templates'
export default defineComponent({
  name: 'template-detail',
  setup(){
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const id = route.params.id as string
    const template = computed<TemplateProps>(()=> store.getters.getTemplateById(parseInt(id)))
    return{
      template
    }
  }
});
</script>
<style>
.work-detail-container{
  margin-top: 50px;
}
.cover-img{
  margin-right: 30px;
}
.cover-img img{
  width: 100%;
}
.use-btn{
  margin: 30px 0;
}
.ant-avatar{
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
.load-btn{
  margin-left: 20px;
}
</style>
