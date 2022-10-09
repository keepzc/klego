<template>
  <h1 class="hello">{{msg}}</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Hello',
  props: {
    msg: String
  }
})
</script>
