import { createApp } from "vue";
import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import App from "./App.vue";
import Antd from "ant-design-vue";
import KpzcLegoComponents from 'kpzc-lego-components'
import "ant-design-vue/dist/antd.less";
import 'kpzc-lego-components/dist/bundle.css'
import 'cropperjs/dist/cropper.css'
import router from "./routes/index";
import store from "./store";
import { RespData } from './store/respTypes'
export type ICustomAxiosConfig = AxiosRequestConfig & {
    opName?: string;
}

const app = createApp(App);
let baseBackendURL = ''
let baseH5URL = ''
if (process.env.NODE_ENV === 'development' || process.env.VUE_APP_STAGINE) {
    // use test backend api when
    // in development env
    // in staging env
    baseBackendURL = 'http://47.93.58.48:7002'
    baseH5URL = 'http://47.93.58.48:7001'
}else {
    baseBackendURL = 'http://47.93.58.48:7002'
    baseH5URL = 'http://47.93.58.48:7001'
}
export { baseBackendURL, baseH5URL }
axios.defaults.baseURL = `${baseBackendURL}/api/`
axios.interceptors.request.use(config => {
    const newConfig = config as ICustomAxiosConfig
    store.commit('setError', { status: false, messgae: ''})
    store.commit('startLoading',{ opName: newConfig.opName })
    return config
})
axios.interceptors.response.use((resp: AxiosResponse<RespData>) => {
    const { config, data } = resp
    const newConfig = config as ICustomAxiosConfig
    store.commit('finishLoading',{ opName: newConfig.opName })  
    const { errno, message } = data
    if (errno !== 0) {
        store.commit('setError', { status: true, message })
        return Promise.reject(data)
    }
    return resp
}, (e: AxiosError) => {
    const newConfig = e.config as ICustomAxiosConfig
    store.commit('setError', { status: true, message: '服务器错误' })
    store.commit('finishLoading', { opName: newConfig.opName })
    return Promise.reject(e)
})

app.use(Antd).use(KpzcLegoComponents).use(router).use(store);
app.mount("#app");
