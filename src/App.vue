<template>
  <div class="app-container">
    <Uploade action="http://123.57.138.48/api/upload/" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Uploade from '@/components/Uploade.vue'

export default defineComponent({
  name: 'App',
  components: {
    Uploade
  },
})
</script>

<style lang="scss">
.page-title {
  color: #fff;
}
</style>
