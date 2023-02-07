import { createStore } from "vuex";
import { ActionContext} from "vuex";
import { compile } from 'path-to-regexp'
import axios, { AxiosRequestConfig } from 'axios'
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import global, { GlobalStatus } from './global'
import {objectToQueryString} from '../helper'
import {forEach} from 'lodash-es'
export interface GlobalDataProps {
    user: UserProps;
    templates: TemplatesProps;
    editor: EditorProps;
    global: GlobalStatus;
}
export interface ActionPayload {
    urlParams?: {[key: string]: any};
    data?: any;
    searchParams?: {[key: string]: any};
}
// 2. 确定参数
export function actionWrapper (url: string, commitName: string, config: AxiosRequestConfig = { method: 'get' }) {
    // 1.  不管三七二十一，先返回一个函数和原来的函数处理一摸一样
    return async (context: ActionContext<any, any>, payload: ActionPayload = {}) => {
        // 3. 写内部重复逻辑
        const {urlParams, data, searchParams} = payload
        const newConfig = { ...config, data, opName: commitName }
        let newUrl = url
        if(urlParams){
            const toPath = compile(url, { encode: encodeURIComponent })
            newUrl = toPath(urlParams)     
        }
        if(searchParams) {
            const search = new URLSearchParams()
            forEach(searchParams, (value,key)=>{
                search.append(key,value)
            })
            // newUrl += '?' + objectToQueryString(searchParams)
            newUrl += '?' + search.toString()
        }
        const resp = await axios(newUrl, newConfig)
        context.commit(commitName, { payload, ...resp.data })
        return resp.data
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
