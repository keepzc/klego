<template>
  <router-link to="/login" v-if="!user.isLogin">
    <a-button type="primary" class="user-profile-component">
      登录
    </a-button>
  </router-link>
  <div v-else>
    <a-dropdown class="user-profile-component">
      <router-link to="/setting">{{ user.data?.nickName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0">创建作品</a-menu-item>
          <a-menu-item key="1" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import user, { UserProps } from '../store/user'
import { message } from 'ant-design-vue'
export default defineComponent({
  name: 'user-profile',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const login = () => {
      store.commit('login')
      message.success('登录成功', 2)
    }
    const logout = () => {
      store.commit('logout')
      message.success('退出登录成功，2秒后跳转到首页', 2)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    return {
      login,
      logout
    }
  }
})
</script>
<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}

.user-operation>* {
  margin-left: 30px !important;
}
</style>
