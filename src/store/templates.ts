import { Module } from "vuex"
import { GlobalDataProps } from "./index"
import { RespListData, RespData } from './respTypes'
import { actionWrapper } from './index'

export interface TemplateProps {
    id: number;
    title: string;
    coverImg: string;
    author: string;
    copiedCount: number;
    desc: string;
    isHot: string;
}

export interface TemplatesProps {
    data: TemplateProps[];
    totalTemplates: number;
    works: TemplateProps[];
    totalWorks: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
    state: {
        data: [],
        totalTemplates: 0,
        works: [],
        totalWorks: 0
    },
    mutations: {
        fetchTemplates(state, rawData: RespListData<TemplateProps>) {
            state.data = rawData.data.list
        },
        fetchWorks(state, rawData: RespListData<TemplateProps>) {
            const {count, list} = rawData.data
            state.works = list
            state.totalWorks = count
        },
        fetchTemplate(state, rawData: RespData<TemplateProps>) {
            state.data = [rawData.data]
        }
    },
    actions: {
        fetchTemplates: actionWrapper('/templates', 'fetchTemplates'),
        fetchWorks: actionWrapper('/works', 'fetchWorks'),
        fetchTemplate: actionWrapper('/templates/:id', 'fetchTemplate')
    },
    getters: {
        getTemplateById: (state, getters, rootState) => (id: number) => {
            return state.data.find((t) => t.id === id);
        }
    }
};

export default templates;
