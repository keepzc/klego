<template>
    <div>
      <h1>{{msg}}</h1>
      <button @click="setCount">{{count}}</button>
      <input type="text" v-model="todo">
      <button class="addTodo" @click="addTodo">add</button>
      <button class="loadUser" @click="loadUser">load</button>
      <p v-if="user.loading" class="loading">Loading</p>
      <div v-else class="userName">{{user.data && user.data.username}}</div>
      <p v-if="user.error" class="error">error!</p>
       <ul>
         <li v-for="(todo,i) in todos" :key="i">{{todo}}</li>
       </ul>
      <Hello msg="123"></Hello>
    </div>
</template>
<script lang="ts">

import { defineComponent, reactive, ref } from 'vue'
import Hello from './Hello.vue'
import axios from 'axios'
export default defineComponent({
  name:'hello-world',
  components:{
    Hello
  },
  props:{
    msg:String
  },
  emits:['send'],
  setup(props,context){
    const count = ref(1)
    const todo = ref('')
    const todos = ref<string[]>([])
    const user = reactive({
      data:null as any,
      loading:false,
      error:false
    })
    const setCount =()=>{
      count.value++
    }
    const addTodo =() =>{
      if(todo.value){
        todos.value.push(todo.value)
        context.emit('send',todo.value)
      }
    }
    const loadUser =() =>{
      user.loading =true
      axios.get('https://jsonplaceholder.typicode.com/users/1').then(resp => {
        console.log(resp)
        user.data = resp.data
      }).catch(() => {
        user.error = true
      }).finally(() => {
        user.loading = false
      })
    }
    return{
      count,
      setCount,
      addTodo,
      loadUser,
      todo,
      todos,
      user
    }
  }
})
</script>
<style>

</style>
