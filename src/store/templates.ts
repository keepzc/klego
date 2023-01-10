import { Module } from "vuex";
import axios from 'axios'
import { GlobalDataProps } from "./index";
import { RespListData } from './respTypes'
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
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
    state: {
        data: []
    },
    mutations: {
        fetchTemplates(state, rawData: RespListData<TemplateProps>) {
            state.data = rawData.data.list
        }
    },
    actions: {
        fetchTemplates: actionWrapper('/templates', 'fetchTemplates')
    },
    getters: {
        getTemplateById: (state, getters, rootState) => (id: number) => {
            return state.data.find((t) => t.id === id);
        }
    }
};

export default templates;
