import { createRouter, createWebHashHistory } from "vue-router";
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
                { path: "", name: "home", component: Home },
                { path: "/template/:id", name: "template", component: TemplateDetail }
            ]
        },
        {
            path: "/editor",
            name: "editor",
            component: Editor
        },
        {
            path: "/login",
            name: "login",
            component: Login
        }
    ]
});

export default router;
