import { Module } from "vuex";
import { v4 as uuidv4 } from "uuid";
import { GlobalDataProps } from "./index";
// import { TextComponentProps, ImageComponentProps } from "../defaultProps";
import {AllComponentProps } from 'kpzc-lego-components'
export interface EditorProps {
    //编辑器渲染数组
    components: ComponentData[];
    //当前编辑器那个元素
    currentElement: string;
    //其他信息
}

export interface PageProps {
    backgroundColor: string;
    backgroundImage: string;
    backgroundRepeat: string;
    backgroundSize: string;
    height: string;
}
export type AllFormProps = PageProps & AllComponentProps
export interface PageData{
    props: PageProps;
    title: string;
}
export interface ComponentData {
    //这个元素属性
    props: Partial<AllComponentProps>;
    //id uuid v4 生成
    id: string;
    //业务组件库名称 l-text,l-image 登登
    name: "l-text" | "l-image" | "l-shape";
    // 图层是否隐藏
    isHidden?: boolean;
    // 图层是否锁定
    isLocked?: boolean;
    // 图层名称
    layerName?: string;
}

export const testComponents: ComponentData[] = [
    {
        id: uuidv4(),
        name: "l-text",
        layerName:'图层1',
        props: { text: "hello", fontSize: "20px", color: "#000000", lineHeight: "1", textAlign: "left", fontFamily: "" }
    },
    {
        id: uuidv4(),
        name: "l-text",
        layerName:'图层2',
        props: {
            text: "hello2",
            fontSize: "10px",
            fontWeight: "bold",
            lineHeight: "2",
            textAlign: "left",
            fontFamily: ""
        }
    },
    {
        id: uuidv4(),
        name: "l-text",
        layerName:'图层3',
        props: { text: "hello3", fontSize: "16px" }
    }
];

const editor: Module<EditorProps, GlobalDataProps> = {
    state: {
        components: testComponents,
        currentElement: ""
    },
    mutations: {
        addComponent(state, component: ComponentData) {
            state.components.push(component);
        },
        setActive(state, currentId: string) {
            state.currentElement = currentId;
        },
        updateComponent(state, { key, value ,id, isRoot}) {
            const updatedComponent = state.components.find((component) => component.id === (id || state.currentElement));
            if (updatedComponent) {
                if(isRoot) {
                    // https://github.com/microsoft/TypeScript/issues/31663
                    (updatedComponent as any)[key] = value
                }else {
                    updatedComponent.props[key as keyof AllComponentProps] = value;
                }
                
            }
        }
    },
    getters: {
        getCurrentElement: (state) => {
            return state.components.find((component) => component.id === state.currentElement);
        }
    }
};

export default editor;
