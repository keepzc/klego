<template>
  <div class="homepage-container">
     <a-layout :style="{background: '#fff'}">
     <!-- <Uploader action="http://123.57.138.48/api/upload/" /> -->
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">慕课乐高</router-link>
        </div>
        <user-profile :user="user" />
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
import { defineComponent,computed } from 'vue'
import UserProfile from '../components/UserProfile.vue'
import Uploader from '../components/Uploader.vue'
import {useStore} from 'vuex'
import {GlobalDataProps} from '../store/index'
export default defineComponent({
  name: 'Index',
  components:{
    UserProfile,
    // Uploader
  },
  setup(){
    const store = useStore<GlobalDataProps>()
    const user = computed(()=> store.state.user)
    return{
      user
    }
  }
})
</script>

<style>
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content-container{
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
