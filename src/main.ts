import { createApp } from "vue";
import axios from 'axios'
import App from "./App.vue";
import Antd from "ant-design-vue";
import KpzcLegoComponents from 'kpzc-lego-components'
import "ant-design-vue/dist/antd.css";
import 'kpzc-lego-components/dist/bundle.css'
import 'cropperjs/dist/cropper.css'
import router from "./routes/index";
import store from "./store";
const app = createApp(App);
const baseBackendUrl = 'http://47.93.58.48:7002'
axios.defaults.baseURL = `${baseBackendUrl}/api/`
app.use(Antd).use(KpzcLegoComponents).use(router).use(store);
app.mount("#app");
