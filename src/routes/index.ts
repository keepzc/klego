import { createRouter, createWebHashHistory } from "vue-router";
import axios from 'axios'
import { message } from 'ant-design-vue'
import store from '../store'
import Index from "../views/Index.vue";
import Home from "../views/Home.vue";
import Editor from "../views/Editor.vue";
import TemplateDetail from "../views/TemplateDetail.vue";
import Login from '../views/Login.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Index",
            component: Index,
            children: [
                { path: "", name: "home", component: Home, meta: { title: '欢迎来到慕课乐高' }},
                { path: "/template/:id", name: "template", component: TemplateDetail ,meta: { title: '模版详情' }}
            ]
        },
        {
            path: "/editor",
            name: "editor",
            component: Editor,
            meta: { requiredLogin: true, title: '编辑我的设计' }
        },
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: {redirectAlreadyLogin: true, title: '登录到慕课乐高', disableLoading :true }
        }
    ]
});

router.beforeEach(async(to, from) => {
    const {user} = store.state
    const {token, isLogin} = user
    console.log(isLogin);
    
    const {redirectAlreadyLogin, requiredLogin, title} = to.meta
    if(title){
        document.title = title as string
    }
    if(!isLogin){
        if(token){
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
            try {
                await store.dispatch('fetchCurrentUser')
                if(redirectAlreadyLogin) {
                    return '/'
                }
            } catch (error) {
                message.error('登录状态已过期 请重新登录', 2)
                store.commit('logout')
                return '/login'
            }
        }else{
            if(requiredLogin){
                return '/login'
            }
        }
    }else{
        if(redirectAlreadyLogin){
            return '/'
        }
    }
})

export default router;
