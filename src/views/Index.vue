<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <!-- <Uploader action="http://123.57.138.48/api/upload/" /> -->
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">慕课乐高</router-link>
        </div>
        <a-menu :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px', width: '525px' }">
          <a-menu-item key="1">
            <a-button type="primary" shape="round" @click="createWork">创建设计</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" shape="round" @click="myWork">我的作品</a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <user-profile :user="user"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content class="content-container">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      © keep版权所有
    </a-layout-footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'
import UserProfile from '../components/UserProfile.vue'
import Uploader from '../components/Uploader.vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store/index'
import { message } from 'ant-design-vue';
export default defineComponent({
  name: 'Index',
  components: {
    UserProfile,
    // Uploader
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const user = computed(() => store.state.user)
    const router = useRouter()
    const createWork = async () => {
      const res = await store.dispatch('createWork', {
        data:
        {
          coverImg: "http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png",
          desc: "未命名作品",
          title: "未命名作品"
        }
      })
      console.log(res);
      if (res.errno === 0) {
        const workId = res.data.id
        router.push(`/editor/${workId}`)
        message.success('创建作品成功', 2)
      }
    }
    const myWork = () => {
      router.push('/mywork')
    }
    return {
      user,
      createWork,
      myWork
    }
  }
})
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}

.page-title {
  color: #fff;
}
</style>
