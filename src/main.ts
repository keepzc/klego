import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import KpzcLegoComponents from 'kpzc-lego-components'
import "ant-design-vue/dist/antd.css";
import 'kpzc-lego-components/dist/bundle.css'
import router from "./routes/index";
import store from "./store";
const app = createApp(App);
app.use(Antd).use(KpzcLegoComponents).use(router).use(store);
app.mount("#app");
