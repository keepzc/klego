import { Module } from "vuex";
import {message} from 'ant-design-vue'
import {cloneDeep} from 'lodash-es'
import { v4 as uuidv4 } from "uuid";
import { GlobalDataProps } from "./index";
// import { TextComponentProps, ImageComponentProps } from "../defaultProps";
import {AllComponentProps,textDefaultProps } from 'kpzc-lego-components'
export interface EditorProps {
    //编辑器渲染数组
    components: ComponentData[];
    //当前编辑器那个元素
    currentElement: string;
    // 当然最后保存的时候还有有一些项目信息，这里并没有写出，等做到的时候再补充
    page: PageData;
    // 当前被复制的组件
    copiedComponent?: ComponentData;
}

export interface PageProps {
    backgroundColor: string;
    backgroundImage: string;
    backgroundRepeat: string;
    backgroundSize: string;
    height: string;
}

export type AllFormProps = PageProps & AllComponentProps

export interface PageData {
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
    { id: uuidv4(), name: 'l-text', layerName:'图层1', props: { ...textDefaultProps, text: 'hello', fontSize: '20px', color: '#000000', 'lineHeight': '1', textAlign: 'left', fontFamily: '', width: '100px', height: '100px', backgroundColor: '#efefef', left: '10px', top: '10px' }},
    // {
    //     id: uuidv4(),
    //     name: "l-text",
    //     layerName:'图层2',
    //     props: {
    //         ...textDefaultProps,
    //         text: "hello2",
    //         fontSize: "10px",
    //         fontWeight: "bold",
    //         lineHeight: "2",
    //         textAlign: "left",
    //         fontFamily: ""
    //     }
    // },
    // {
    //     id: uuidv4(),
    //     name: "l-text",
    //     layerName:'图层3',
    //     props: { ...textDefaultProps,text: "hello3", fontSize: "16px" }
    // }
];
const pageDefaultProps = { backgroundColor: '#ffffff', backgroundImage: '', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', height: '560px' }
const editor: Module<EditorProps, GlobalDataProps> = {
    state: {
        components: testComponents,
        currentElement: "",
        page: {
            props: pageDefaultProps,
            title: 'test title'
        }
    },
    mutations: {
        addComponent(state, component: ComponentData) {
            state.components.push(component);
        },
        setActive(state, currentId: string) {
            state.currentElement = currentId;
        },
        copyComponent(state, id: string){
            const currentComponent = state.components.find(component=> component.id === id)
            if(currentComponent) {
                state.copiedComponent = currentComponent
                message.success('已拷贝当前图层', 1)
            }
        },
        pastCopiedComponent(state){
            if(state.copiedComponent){
                const clone = cloneDeep(state.copiedComponent)
                clone.id = uuidv4()
                clone.layerName = clone.layerName + '副本'
                state.components.push(clone)
                message.success('已粘贴当前图层', 1)
            }
        },
        deleteComponent(state, id: string) {
            const currentComponent = state.components.find(component=> component.id === id)
            if(currentComponent){
                state.components = state.components.filter(component => component.id !== id)
                message.success('删除当前图层成功', 1)
            }
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
        },
        updatePage(state, {key,value}) {
            state.page.props[key as keyof PageProps] = value
        }
    },
    getters: {
        getCurrentElement: (state) => {
            return state.components.find((component) => component.id === state.currentElement);
        }
    }
};

export default editor;
