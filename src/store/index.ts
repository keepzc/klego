import { createStore } from "vuex";
import { ActionContext} from "vuex";
import axios, { AxiosRequestConfig } from 'axios'
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import global, { GlobalStatus } from './global'
export interface GlobalDataProps {
    user: UserProps;
    templates: TemplatesProps;
    editor: EditorProps;
    global: GlobalStatus;
}
// 2. 确定参数
export function actionWrapper (url: string, commitName: string, config: AxiosRequestConfig = { method: 'get' }) {
    // 1.  不管三七二十一，先返回一个函数和原来的函数处理一摸一样
    return async (context: ActionContext<any, any>, payload?: any) => {
        // 3. 写内部重复逻辑
        const newConfig = { ...config, data: payload, opName: commitName }
        const { data } = await axios(url, newConfig)
        context.commit(commitName, data)
        return data
    }
}
const store = createStore({
    modules: {
        user,
        templates,
        editor,
        global
    }
});


export default store;
