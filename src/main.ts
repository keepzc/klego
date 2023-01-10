import { createApp } from "vue";
import axios, {AxiosRequestConfig} from 'axios'
import App from "./App.vue";
import Antd from "ant-design-vue";
import KpzcLegoComponents from 'kpzc-lego-components'
import "ant-design-vue/dist/antd.css";
import 'kpzc-lego-components/dist/bundle.css'
import 'cropperjs/dist/cropper.css'
import router from "./routes/index";
import store from "./store";
export type ICustomAxiosConfig = AxiosRequestConfig & {
    opName?: string;
}
const app = createApp(App);
const baseBackendUrl = 'http://47.93.58.48:7002'
axios.defaults.baseURL = `${baseBackendUrl}/api/`
axios.interceptors.request.use(config => {
    const newConfig = config as ICustomAxiosConfig
    console.log(newConfig.opName,'---');
    
    store.commit('startLoading',{ opName: newConfig.opName })
    return config
})
axios.interceptors.response.use(resp => {
    const { config } = resp
    const newConfig = config as ICustomAxiosConfig
    store.commit('finishLoading',{ opName: newConfig.opName })
    return resp
})

app.use(Antd).use(KpzcLegoComponents).use(router).use(store);
app.mount("#app");
